module app {
  interface IProjectScope extends angular.IScope {
    config:IConfiguration
    projectId : string
    state:IState
    currentPage : number
    error : string
    sparqlEndpointOK : boolean
    openSPARQL : () => void
    loadSPARQL : () => void
    loadCSVFile : (file:File) => void
    saveCSVFile : () => void
    focus : (index:number) => void
    search : (index:number,text:string) => void
    queryRunning : boolean
  }

  interface IParams {
    config : string
    projectId : string
  }

  interface IQuery {
    index : number,
    text : string
  }

  export class ProjectController {

    private canceler : angular.IDeferred<{}>
    constructor($scope: IProjectScope,
                $localStorage : IProjectStorage,
                $state : angular.ui.IStateService,
                $stateParams : IParams,
                $q:angular.IQService,
                sparqlService:SparqlService,
                hotkeys:angular.hotkeys.HotkeysProvider,
                $modal:angular.ui.bootstrap.IModalService,
                focus:any,
                base64:IBase64Service) {
      // initialization
      $scope.projectId = $stateParams.projectId
      if (!$localStorage.projects) $localStorage.projects = {}
      if (!$localStorage.projects[$stateParams.projectId]) $localStorage.projects[$stateParams.projectId]={
        config : null,
        state : null
      }
      var config = $localStorage.projects[$stateParams.projectId].config
      if (!config) {
        $state.go('configure',{projectId:$stateParams.projectId})
        return
      }
      $scope.config = config
      if (!$localStorage.projects[$stateParams.projectId].state) $localStorage.projects[$stateParams.projectId].state = {
        currentRow : 0,
        currentOffset : 0,
        reconData : [],
        data : [],
        sparqlEndpoint : undefined,
        loadQuery : undefined,
        fileName : undefined,
        counts : {
          match : 0,
          nomatch : 0
        }
      }
      var state = $localStorage.projects[$stateParams.projectId].state
      $scope.state=state
      $scope.currentPage = state.currentOffset / config.pageSize + 1
      hotkeys.bindTo($scope).add({
        combo: 'shift+tab',
        allowIn: ['INPUT'],
        callback: (event:Event,hotkey:angular.hotkeys.Hotkey) => {
          if (state.currentRow==state.currentOffset) {
            $scope.currentPage--
            if ($scope.currentPage==0) $scope.currentPage = Math.floor(state.data.length/config.pageSize + 1)
          }
        }
      })
      hotkeys.bindTo($scope).add({
        combo: 'tab',
        allowIn: ['INPUT'],
        callback: (event:Event,hotkey:angular.hotkeys.Hotkey) => {
          if (state.currentRow==state.currentOffset+config.pageSize - 1 || state.currentRow==state.data.length - 1) {
            $scope.currentPage++
            if (($scope.currentPage - 1)*config.pageSize>state.data.length) $scope.currentPage = 1
          }
        }
      })
      hotkeys.bindTo($scope).add({
        combo: '0',
        allowIn: ['INPUT'],
        callback: (event:Event,hotkey:angular.hotkeys.Hotkey) => {
          if (state.reconData[state.currentRow].match) state.counts.match--
          state.counts.nomatch++
          state.reconData[state.currentRow].match=null
          if (state.currentRow==state.currentOffset+config.pageSize - 1) {
            $scope.currentPage++
            if (($scope.currentPage - 1)*config.pageSize>state.data.length) $scope.currentPage = 1
          } else focus("row"+(state.currentRow+1))
          event.preventDefault()
        }
      })
      for (let number=1;number<10;number++) hotkeys.bindTo($scope).add({
        combo: ''+number,
        allowIn: ['INPUT'],
        callback: (event:Event,hotkey:angular.hotkeys.Hotkey) => {
          if (!state.reconData[state.currentRow].match) {
            state.counts.match++
            if (state.reconData[state.currentRow].match===null) state.counts.nomatch--
          }
          state.reconData[state.currentRow].match=state.reconData[state.currentRow].candidates[(parseInt(hotkey.combo[0])-1)]

          if (state.currentRow==state.currentOffset+config.pageSize - 1) {
            $scope.currentPage++
            if (($scope.currentPage - 1)*config.pageSize>state.data.length) $scope.currentPage = 1
          } else focus("row"+(state.currentRow+1))
          event.preventDefault()
        }
      })
      // support functions
      var handleError = (error) => $scope.error=error
      $scope.$watch('currentPage',(nv:number,ov:number) => {
        if (!nv) nv = ov = 1
        state.currentOffset = (nv - 1)*config.pageSize
        if (nv == ov - 1) state.currentRow = state.currentOffset+config.pageSize - 1
        else if (ov == 1 && nv == Math.floor(state.data.length/config.pageSize + 1)) state.currentRow = state.data.length - 1
        else state.currentRow = state.currentOffset
        focus("row"+state.currentRow)
        let fm = []
        let til = state.currentOffset+config.pageSize
        if (til > state.data.length) til = state.data.length
        for (let index=state.currentOffset;index<til;index++) if (!state.reconData[index]) fm.push({index,text:state.data[index][0]})
        findMatches(fm)
      })
      this.canceler = $q.defer()
      $scope.$watch('state.sparqlEndpoint', (nv:string,ov:string) => {
        if (nv) {
          this.canceler.resolve()
          this.canceler = $q.defer()
          sparqlService.check(nv,{timeout:this.canceler.promise}).then((ok:boolean) => $scope.sparqlEndpointOK=ok)
        }
      })
      $scope.loadSPARQL = () => {
        this.canceler.resolve()
        this.canceler = $q.defer()
        sparqlService.query(state.sparqlEndpoint,state.loadQuery,{timeout:this.canceler.promise}).then(
          (response : angular.IHttpPromiseCallbackArg<ISparqlBindingResult>) => {
            var data = {}
            const idvar = response.data.head.vars[0]
            response.data.results.bindings.filter(binding => binding['entity'] ? true : false).forEach(binding => {
              const id = binding[idvar].value
              if (!data[id]) data[id]={}
              response.data.head.vars.forEach(currentVar => {
                if (binding[currentVar]) {
                  if (!data[id][currentVar]) data[id][currentVar]={}
                  data[id][currentVar][binding[currentVar].value]=true
                }
              })
            });
            state.data=[]
            for (var id in data) { //can't use let
              var cdata = [] //can't use const
              response.data.head.vars.forEach(currentVar => {
                let ccell = ""
                for (let val in data[id][currentVar]) ccell+=val+", "
                cdata.push(ccell.substr(0,ccell.length-2))
              })
              cdata.splice(1,0,id)
              state.data.push(cdata)
            }
            state.currentRow = 0
            state.currentOffset = 0
            $scope.currentPage = 1
            state.reconData=[]
            let fm = []
            let til = state.currentOffset+config.pageSize
            if (til > state.data.length) til = state.data.length
            for (let index=state.currentOffset;index<til;index++) if (!state.reconData[index]) fm.push({index,text:state.data[index][0]})
            findMatches(fm)
          }
          ,handleError
        )
      }
      $scope.openSPARQL = () => {
        $modal.open({
          templateUrl : 'loadSPARQL',
          scope : $scope,
          size : 'lg'
        })
      }
      $scope.saveCSVFile = () => {
        var data = []
        state.data.forEach((row,index) => {
          const nrow = row.slice()
          if (state.reconData[index] && state.reconData[index].match)
            nrow.splice(1,0,state.reconData[index].match.id)
          else nrow.splice(1,0,undefined)
          data.push(nrow)
        })
        saveAs(new Blob([Papa.unparse(data)], {type : 'text/csv'}),"reconciled-"+state.fileName)
      }
      $scope.loadCSVFile = (file:File) => {
        if (!file) return
        state.fileName=file.name
        Papa.parse(file, { complete: (csv) => {
          state.data=csv.data
          state.currentRow = 0
          state.currentOffset = 0
          state.counts = {
            match : 0,
            nomatch : 0
          }
          $scope.currentPage = 1
          state.reconData=[]
          let fm = []
          let til = state.currentOffset+config.pageSize
          if (til > state.data.length) til = state.data.length
          for (let index=state.currentOffset;index<til;index++) if (!state.reconData[index]) fm.push({index,text:state.data[index][0]})
          findMatches(fm)
          $scope.$digest()
        , {error:handleError} }
        })
      }
      var findMatches = (queries : IQuery[]) => {
        if (queries.length==0) return
        const queryParts = config.matchQuery.split(/[\{\}] # \/?QUERY/)
        let queryText=queryParts[0]
        queries.forEach(q =>queryText+="{"+queryParts[1].replace(/<QUERY_ID>/g,""+q.index).replace(/<QUERY>/g,sparqlService.stringToSPARQLString(q.text))+"} UNION")
        queryText=queryText.substring(0,queryText.length-6)+queryParts[2]
        this.canceler.resolve()
        $scope.queryRunning = true
        this.canceler=$q.defer()
        sparqlService.query(config.sparqlEndpoint,queryText,{timeout:this.canceler.promise}).then(
          (response : angular.IHttpPromiseCallbackArg<ISparqlBindingResult>) => {
            $scope.error = undefined
            $scope.queryRunning = false
            const candidatesHashes = {}
            response.data.results.bindings.filter(binding => binding['entity'] ? true : false).forEach((binding,index) => {
              if (!candidatesHashes[binding['queryId'].value]) candidatesHashes[binding['queryId'].value] = {}
              const candidatesHash = candidatesHashes[binding['queryId'].value]
              if (!candidatesHash[binding['entity'].value]) candidatesHash[binding['entity'].value] = {
                index:index,
                id:binding['entity'].value,
                label:binding['label'].value,
                color:'rgb(127,'+Math.floor(127+parseFloat(binding['score'].value)*127)+',127)',
                description:[]
              }
              for (let pname in binding) if (pname!='queryId' && pname!='entity' && pname!='label' && pname!='score')
                candidatesHash[binding['entity'].value].description.push(binding[pname].value)
            })
            for (let index in candidatesHashes) {
              if (!state.reconData[index]) state.reconData[index]={match:undefined,candidates:[]}
              const candidates = []
              for (let candidate in candidatesHashes[index]) candidates.push(candidatesHashes[index][candidate])
              candidates.sort((a,b) => a.index - b.index)
              state.reconData[index].candidates = candidates
            }
          }
          ,handleError
        )
      }
      $scope.focus = (index) => state.currentRow = index
      $scope.search = (index,text) => findMatches([{text,index}])
    }
  }
}
