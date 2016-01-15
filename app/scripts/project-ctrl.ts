namespace fi.seco.recon {
  'use strict'

  import s = fi.seco.sparql

  interface IProjectScope extends angular.IScope {
    config: IConfiguration
    projectId: string
    state: IState
    currentPage: number
    error: angular.IHttpPromiseCallbackArg<string>
    sparqlEndpointOK: boolean
    loadExcelSheet: () => void
    openSPARQL: () => void
    loadSPARQL: () => void
    loadCSVFile: (file: File) => void
    saveCSVFile: () => void
    select: (index: number) => void
    deselect: () => void
    focus: (index: number, text: string) => void
    search: (index: number, text: string) => void
    queryRunning: boolean
    reviewing: boolean
    excelSheets: ExcelSheet[]
  }

  class ExcelSheet {
    constructor(
      public name: string
    ) {}
    public headers: string[] = []
    public data: string[][] = []
    public active: boolean = false
  }

  interface IParams {
    config: string
    projectId: string
  }

  interface IQuery {
    index: number,
    text: string
  }

  declare var XLSX: any

  export class ProjectController {

    private canceler: angular.IDeferred<{}>
    constructor($scope: IProjectScope,
                $localStorage: IProjectStorage,
                $state: angular.ui.IStateService,
                $stateParams: IParams,
                $q: angular.IQService,
                sparqlService: s.SparqlService,
                hotkeys: angular.hotkeys.HotkeysProvider,
                $uibModal: angular.ui.bootstrap.IModalService,
                $sce: angular.ISCEService,
                focus: any,
                base64: IBase64Service) {
      // initialization
      $scope.projectId = $stateParams.projectId
      if (!$localStorage.projects) $localStorage.projects = {}
      if (!$localStorage.projects[$stateParams.projectId]) $localStorage.projects[$stateParams.projectId] = {
        config: null,
        state: null
      }
      let config: IConfiguration = $localStorage.projects[$stateParams.projectId].config
      if (!config) {
        $state.go('configure', {projectId: $stateParams.projectId})
        return
      }
      $scope.config = config
      if (!$localStorage.projects[$stateParams.projectId].state) $localStorage.projects[$stateParams.projectId].state = {
        currentRow: 0,
        currentOffset: 0,
        reconData: [],
        data: [],
        sparqlEndpoint: undefined,
        loadQuery: undefined,
        fileName: undefined,
        counts: {
          match: 0,
          nomatch: 0
        }
      }
      let state: IState = $localStorage.projects[$stateParams.projectId].state
      $scope.state = state
      $scope.currentPage = state.currentOffset / config.pageSize + 1
      hotkeys.bindTo($scope).add({
        combo: 'shift+tab',
        allowIn: ['INPUT'],
        callback: (event: Event, hotkey: angular.hotkeys.Hotkey): void => {
          if (state.currentRow === state.currentOffset) {
            $scope.currentPage--
            if ($scope.currentPage === 0) $scope.currentPage = Math.floor(state.data.length / config.pageSize + 1)
          }
        }
      })
      hotkeys.bindTo($scope).add({
        combo: 'tab',
        allowIn: ['INPUT'],
        callback: (event: Event, hotkey: angular.hotkeys.Hotkey): void => {
          if (state.currentRow === state.currentOffset + config.pageSize - 1 || state.currentRow === state.data.length - 1) {
            $scope.currentPage++
            if (($scope.currentPage - 1) * config.pageSize > state.data.length) $scope.currentPage = 1
          }
        }
      })
      hotkeys.bindTo($scope).add({
        combo: '0',
        allowIn: ['INPUT'],
        callback: (event: Event, hotkey: angular.hotkeys.Hotkey): void => {
          if (!state.reconData[state.currentRow]) state.reconData[state.currentRow] = {
            match: undefined,
            candidates: []
          }
          if (state.reconData[state.currentRow].match) state.counts.match--
          state.counts.nomatch++
          state.reconData[state.currentRow].match = null
          if (state.currentRow === state.currentOffset + config.pageSize - 1) {
            $scope.currentPage++
            if (($scope.currentPage - 1) * config.pageSize > state.data.length) $scope.currentPage = 1
          } else focus('row' + (state.currentRow + 1))
          event.preventDefault()
        }
      })
      for (let number: number = 1; number < 10; number++) hotkeys.bindTo($scope).add({
        combo: '' + number,
        allowIn: ['INPUT'],
        callback: (event: Event, hotkey: angular.hotkeys.Hotkey): void => {
          if (!state.reconData[state.currentRow].match) {
            state.counts.match++
            if (state.reconData[state.currentRow].match === null) state.counts.nomatch--
          }
          state.reconData[state.currentRow].match = state.reconData[state.currentRow].candidates[(parseInt(hotkey.combo[0], 10) - 1)]

          if (state.currentRow === state.currentOffset + config.pageSize - 1) {
            $scope.currentPage++
            if (($scope.currentPage - 1) * config.pageSize > state.data.length) $scope.currentPage = 1
          } else focus('row' + (state.currentRow + 1))
          event.preventDefault()
        }
      })
      // support functions
      let handleError: (error: angular.IHttpPromiseCallbackArg<string>) => void = (error: angular.IHttpPromiseCallbackArg<string>) => $scope.error = error
      let lastMultifetchFailed: boolean = false
      let findMatches: (queries: IQuery[]) => void = (queries: IQuery[]) => {
        queries = queries.filter((q: IQuery) => q.text !== '')
        if (queries.length === 0) return
        const queryParts: string[] = config.matchQuery.split(/[\{\}] # \/?QUERY/)
        let queryText: string = queryParts[0]
        queries.forEach((q: IQuery) => {
          let currentQuery: string = queryParts[1].replace(/<QUERY_ID>/g, '' + q.index).replace(/<QUERY>/g, sparqlService.stringToSPARQLString(q.text))
          state.data[q.index].forEach((value: string, index: number) => {
            currentQuery = currentQuery.replace(new RegExp('<CELL_' + index + '>', 'g'), sparqlService.stringToSPARQLString(value))
          })
          queryText += '{' + currentQuery + '} UNION'
        })
        queryText = queryText.substring(0, queryText.length - 6) + queryParts[2]
        this.canceler.resolve()
        $scope.queryRunning = true
        this.canceler = $q.defer()
        sparqlService.query(config.sparqlEndpoint, queryText, {timeout: this.canceler.promise}).then(
          (response: angular.IHttpPromiseCallbackArg<s.ISparqlBindingResult<{[id: string]: s.ISparqlBinding}>>) => {
            if (queries.length > 1) lastMultifetchFailed = false
            queries.forEach((q: IQuery) => { if (state.reconData[q.index]) delete state.reconData[q.index].candidates})
            $scope.error = undefined
            $scope.queryRunning = false
            const candidatesHashes: {[id: string]: {[id: string]: ICandidate}} = {}
            response.data.results.bindings.filter(binding => binding['entity'] ? true : false).forEach((binding, index) => {
              if (!candidatesHashes[binding['queryId'].value]) candidatesHashes[binding['queryId'].value] = {}
              const candidatesHash: {[id: string]: ICandidate} = candidatesHashes[binding['queryId'].value]
              if (!candidatesHash[binding['entity'].value]) candidatesHash[binding['entity'].value] = {
                index: index,
                id: binding['entity'].value,
                label: binding['label'].value,
                color: 'rgb(127,' + Math.floor(127 + parseFloat(binding['score'].value) * 127) + ',127)',
                description: []
              }
              response.data.head.vars.filter(pname => pname !== 'queryId' && pname !== 'entity' && pname !== 'label' && pname !== 'score').forEach(pname => candidatesHash[binding['entity'].value].description.push(binding[pname] ? binding[pname].value : ''))
            })
            for (let index in candidatesHashes) {
              if (!state.reconData[index]) state.reconData[index] = {match: undefined, candidates: []}
              const candidates: ICandidate[] = []
              for (let candidate in candidatesHashes[index]) candidates.push(candidatesHashes[index][candidate])
              candidates.sort((a, b) => a.index - b.index)
              state.reconData[index].candidates = candidates
            }
          },
          (response: angular.IHttpPromiseCallbackArg<string>) => {
            if (queries.length > 1) {
              lastMultifetchFailed = true
              findMatches([{text: state.data[state.currentRow][0], index: state.currentRow}])
            } else handleError(response)
          }
        )
      }
      $scope.$watch('currentPage', (nv: number, ov: number) => {
        if (!nv) nv = ov = 1
        state.currentOffset = (nv - 1) * config.pageSize
        if (nv === ov - 1) state.currentRow = state.currentOffset + config.pageSize - 1
        else if (ov === 1 && nv === Math.floor(state.data.length / config.pageSize + 1)) state.currentRow = state.data.length - 1
        else state.currentRow = state.currentOffset
        if (!$scope.reviewing) focus('row' + state.currentRow)
        let fm: IQuery[] = []
        let til: number = state.currentOffset + config.pageSize
        if (til > state.data.length) til = state.data.length
        for (let index: number = state.currentOffset; index < til; index++) if (!state.reconData[index]) fm.push({index, text: state.data[index][0]})
        findMatches(fm)
      })
      this.canceler = $q.defer()
      $scope.$watch('state.sparqlEndpoint', (nv: string, ov: string) => {
        if (nv) {
          this.canceler.resolve()
          this.canceler = $q.defer()
          sparqlService.check(nv, {timeout: this.canceler.promise}).then((ok: boolean) => $scope.sparqlEndpointOK = ok)
        }
      })
      $scope.loadSPARQL = () => {
        this.canceler.resolve()
        this.canceler = $q.defer()
        sparqlService.query(state.sparqlEndpoint, state.loadQuery, {timeout: this.canceler.promise}).then(
          (response: angular.IHttpPromiseCallbackArg<s.ISparqlBindingResult<{[id: string]: s.ISparqlBinding}>>) => {
            let data: {[id: string]: {[id: string]: {[id: string]: boolean}}} = {}
            const idvar: string = response.data.head.vars[0]
            response.data.results.bindings.filter(binding => binding['entity'] ? true : false).forEach(binding => {
              const id: string = binding[idvar].value
              if (!data[id]) data[id] = {}
              response.data.head.vars.forEach(currentVar => {
                if (binding[currentVar]) {
                  if (!data[id][currentVar]) data[id][currentVar] = {}
                  data[id][currentVar][binding[currentVar].value] = true
                }
              })
            });
            state.data = []
            /* tslint:disable:no-var-keyword */
            for (var id in data) { // can't use let
              var cdata: string[] = [] // can't use const
              /* tslint:enable:no-var-keyword */
              response.data.head.vars.forEach(currentVar => {
                let ccell: string = ''
                for (let val in data[id][currentVar]) ccell += val + ', '
                cdata.push(ccell.substr(0, ccell.length - 2))
              })
              cdata.splice(1, 0, id)
              state.data.push(cdata)
            }
            state.currentRow = 0
            state.currentOffset = 0
            $scope.currentPage = 1
            state.reconData = []
            let fm: IQuery[] = []
            let til: number = state.currentOffset + config.pageSize
            if (til > state.data.length) til = state.data.length
            for (let index: number = state.currentOffset; index < til; index++) if (!state.reconData[index]) fm.push({index, text: state.data[index][0]})
            findMatches(fm)
          },
          handleError
        )
      }
      $scope.openSPARQL = () => {
        $uibModal.open({
          templateUrl: 'loadSPARQL',
          scope: $scope,
          size: 'lg'
        })
      }
      $scope.saveCSVFile = () => {
        let data: string[][] = []
        state.data.forEach((row, index) => {
          const nrow: string[] = row.slice()
          if (state.reconData[index] && state.reconData[index].match)
            nrow.splice(1, 0, state.reconData[index].match.id)
          else nrow.splice(1, 0, undefined)
          data.push(nrow)
        })
        saveAs(new Blob([Papa.unparse(data)], {type: 'text/csv'}), 'reconciled-' + state.fileName)
      }
      let init: (data: string[][]) => void = (data: string[][]) => {
        state.data = data
        state.currentRow = 0
        state.currentOffset = 0
        state.counts = {
          match: 0,
          nomatch: 0
        }
        $scope.currentPage = 1
        state.reconData = []
        let fm: IQuery[] = []
        let til: number = state.currentOffset + config.pageSize
        if (til > state.data.length) til = state.data.length
        for (let index: number = state.currentOffset; index < til; index++) if (!state.reconData[index]) fm.push({index, text: state.data[index][0]})
        findMatches(fm)
        $scope.$digest()
      }
      $scope.loadExcelSheet = () => {
        $scope.excelSheets.filter(s => s.active).forEach(s => init(s.data))
      }
      $scope.loadCSVFile = (file: File) => {
        if (!file) return
        state.fileName = file.name
        if (file.type === 'text/csv')
          Papa.parse(file, { complete: (csv): void => {
            if (csv.errors.length !== 0)
              handleError({data: csv.errors.map(e => e.message).join('\n')})
            else init(csv.data)
          }
          , error: (error: PapaParse.ParseError): void => handleError({data: error.message})})
        else {
          let reader: FileReader = new FileReader()
          reader.onload = () => {
            let workBook: any = XLSX.read(reader.result, {type: 'binary'})
            $scope.excelSheets = []
            workBook.SheetNames.forEach(sn => {
              let sheet: ExcelSheet = new ExcelSheet(sn)
              let sheetJson: {}[] = XLSX.utils.sheet_to_json(workBook.Sheets[sn])
              for (let header in sheetJson[0]) if (!header.startsWith('__')) sheet.headers.push(header)
              sheet.data = XLSX.utils.sheet_to_json(workBook.Sheets[sn]).map(row => {
                let row2: string[] = []
                sheet.headers.forEach(h => row2.push(row[h]))
                return row2
              })
              $scope.excelSheets.push(sheet)
            })
            $scope.excelSheets[0].active = true
            $uibModal.open({
              templateUrl: 'selectSheet',
              scope: $scope,
              size: 'lg'
            })
          }
          reader.readAsBinaryString(file)
        }
      }
      $scope.deselect = () => {
        if (state.reconData[state.currentRow].match) state.counts.match--
        state.counts.nomatch++
        state.reconData[state.currentRow].match = null
        if (state.currentRow === state.currentOffset + config.pageSize - 1) {
          $scope.currentPage++
          if (($scope.currentPage - 1) * config.pageSize > state.data.length) $scope.currentPage = 1
        } else focus('row' + (state.currentRow + 1))
      }
      $scope.select = (index) => {
        if (!state.reconData[state.currentRow].match) {
          state.counts.match++
          if (state.reconData[state.currentRow].match === null) state.counts.nomatch--
        }
        state.reconData[state.currentRow].match = state.reconData[state.currentRow].candidates[index]

        if (state.currentRow === state.currentOffset + config.pageSize - 1) {
          $scope.currentPage++
          if (($scope.currentPage - 1) * config.pageSize > state.data.length) $scope.currentPage = 1
        } else focus('row' + (state.currentRow + 1))
      }
      $scope.focus = (index, text) => {
        $scope.reviewing = false
        state.currentRow = index
        if (lastMultifetchFailed && (!state.reconData[index] || !state.reconData[index].candidates || state.reconData[index].candidates.length === 0)) findMatches([{text, index}])
      }
      $scope.search = (index, text) => findMatches([{text, index}])
    }
  }
}
