module app {
  export interface IConfigureScope extends angular.IScope {
    config : IConfiguration
    state : IState
    sparqlEndpointOK : boolean
    serialize : () => string
    deleteProject : () => void
    importProject : (File) => void
    exportProject : () => void
    deleteData : () => void
    projectId : string
  }

  export interface IConfiguration {
    sparqlEndpoint : string
    pageSize : number
    matchQuery : string
  }

  export interface IProjectStorage {
    projects : { [id: string] : {
      config:IConfiguration
      state:IState
    } }
  }

  export interface IState {
    sparqlEndpoint : string
    loadQuery : string
    fileName : string
    currentRow : number
    currentOffset : number
    reconData : IReconData[]
    data : string[][]
    counts : {
      match: number
      nomatch : number
    }
  }

  export interface IReconData {
    match: {
      id:string
    }
    candidates : {
      id:string
    }[]
  }

  export interface IBase64Service {
    urlencode : (str : string) => string
    urldecode : (str : string) => string
  }

  interface IParams {
    projectId : string
  }

  export class ConfigureController {

    private canceler : angular.IDeferred<{}>
    constructor($scope: IConfigureScope,$localStorage:IProjectStorage,$stateParams : IParams,$state:angular.ui.IStateService,$q:angular.IQService,sparqlService:SparqlService,base64:IBase64Service) {
      $scope.projectId = $stateParams.projectId
      if (!$localStorage.projects[$stateParams.projectId].config) $localStorage.projects[$stateParams.projectId].config = {
        sparqlEndpoint : 'http://',
        pageSize : 15,
        matchQuery : `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
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
}`
      }
      $scope.config = $localStorage.projects[$stateParams.projectId].config
      $scope.state = $localStorage.projects[$stateParams.projectId].state
      this.canceler = $q.defer()
      $scope.importProject = (file:File) => {
        if (!file) return
        var reader = new FileReader()
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
        saveAs(new Blob([JSON.stringify($localStorage.projects[$stateParams.projectId])], {type : 'application/json'}),$stateParams.projectId+".json")
      }
      $scope.deleteData = () => {
        $localStorage.projects[$stateParams.projectId].state = null
        $scope.state = null
      }
      $scope.$watch('config.sparqlEndpoint',(nv:string,ov:string) => {
        if (nv) {
          this.canceler.resolve()
          this.canceler = $q.defer()
          sparqlService.check(nv,{timeout:this.canceler.promise}).then((ok:boolean) => $scope.sparqlEndpointOK = ok)
        }
      })
    }
  }
}
