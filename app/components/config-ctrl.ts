namespace fi.seco.recon {
  'use strict'

  import s = fi.seco.sparql

  export interface IConfigureScope extends angular.IScope {
    config: IConfiguration
    state: IState
    sparqlEndpointOK: boolean
    serialize: () => string
    deleteProject: () => void
    importProject: (File) => void
    copyProject: (project: string) => void
    otherProjects: string[]
    exportProject: () => void
    deleteData: () => void
    projectId: string
  }

  export interface IConfiguration {
    sparqlEndpoint: string
    pageSize: number
    matchQuery: string
    loadSparqlEndpoint: string
    loadQuery: string
  }

  export interface IProject {
    config: IConfiguration
    state: IState
  }

  export interface IProjectStorage {
    projects: { [id: string]: IProject }
  }

  export interface IState {
    sparqlEndpoint: string
    loadQuery: string
    fileName: string
    currentRow: number
    currentOffset: number
    reconData: IReconData[]
    data: string[][]
    counts: {
      match: number
      nomatch: number
    }
    headings: string[]
    descriptionHeadings: string[]
    additionalDescriptionHeadings: string[]
  }

  export interface IReconData {
    matches: IMatch[]
    notes: string
    candidates: ICandidate[]
  }

  export interface IMatch {
    id: string
  }

  export interface ICandidate {
    index: number
    id: string
    label: string
    color: string
    description: string[]
    additionalDescription: string[]
  }

  export interface IBase64Service {
    urlencode: (str: string) => string
    urldecode: (str: string) => string
  }

  interface IParams {
    projectId: string
    configURL?: string
  }

  export class ConfigureController {

    private canceler: angular.IDeferred<{}>
    constructor($scope: IConfigureScope, $localStorage: IProjectStorage, $stateParams: IParams, $state: angular.ui.IStateService, $q: angular.IQService, sparqlService: s.SparqlService, base64: IBase64Service, $http: angular.IHttpService) {
      if ($stateParams.configURL) {
        $http.get($stateParams.configURL).then(
          (response: angular.IHttpPromiseCallbackArg<IProject>) => {
            $localStorage.projects[$stateParams.projectId] = response.data
            $state.go('project', { projectId: $stateParams.projectId} )
          }
        )
      } else {
        $scope.projectId = $stateParams.projectId
        if (!$localStorage.projects[$stateParams.projectId].config) $localStorage.projects[$stateParams.projectId].config = {
          sparqlEndpoint: 'http://',
          pageSize: 15,
          matchQuery: `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
  SELECT ?queryId ?entity ?label ?score {
    { # QUERY
      {
        SELECT ?entity {
          BIND(<QUERY> AS ?label)
          ?entity rdfs:label|skos:prefLabel ?label .
        }
        LIMIT 30
      }
      BIND(1.0 AS ?score)
      BIND(<CELL_1> AS ?cell1)
      BIND(<QUERY_ID> AS ?queryId)
    } # /QUERY
    ?entity rdfs:label|skos:prefLabel ?label .
  }`,
          loadSparqlEndpoint: undefined,
          loadQuery: undefined
        }
        $scope.config = $localStorage.projects[$stateParams.projectId].config
        $scope.state = $localStorage.projects[$stateParams.projectId].state
        this.canceler = $q.defer()
        $scope.otherProjects = []
        for (let project in $localStorage.projects) if (project !== $stateParams.projectId) $scope.otherProjects.push(project)
        $scope.copyProject = (project: string) => {
          $localStorage.projects[$stateParams.projectId] = $localStorage.projects[project]
          $scope.config = $localStorage.projects[$stateParams.projectId].config
          $scope.state = $localStorage.projects[$stateParams.projectId].state
        }
        $scope.importProject = (file: File) => {
          if (!file) return
          let reader: FileReader = new FileReader()
          reader.onload = () => {
            $localStorage.projects[$stateParams.projectId] = JSON.parse(reader.result)
            $scope.config = $localStorage.projects[$stateParams.projectId].config
            $scope.state = $localStorage.projects[$stateParams.projectId].state
            $scope.$digest()
          }
          reader.readAsText(file)
        }
        $scope.deleteProject = () => {
          delete $localStorage.projects[$stateParams.projectId]
          $state.go('projectlist')
        }
        $scope.exportProject = () => {
          saveAs(new Blob([JSON.stringify($localStorage.projects[$stateParams.projectId])], {type: 'application/json'}), $stateParams.projectId + '.json')
        }
        $scope.deleteData = () => {
          $localStorage.projects[$stateParams.projectId].state = null
          $scope.state = null
        }
        $scope.$watch('config.sparqlEndpoint', (nv: string, ov: string) => {
          if (nv) {
            this.canceler.resolve()
            this.canceler = $q.defer()
            sparqlService.check(nv, { timeout: this.canceler.promise }).then((ok: boolean) => $scope.sparqlEndpointOK = ok)
          }
        })
      }
    }
  }
}
