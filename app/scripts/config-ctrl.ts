module app {
  export interface IConfigureScope extends angular.IScope {
    serializedConfiguration : string
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
        sparqlEndpoint : 'http://ldf.fi/emlo/sparql',
        pageSize : 15,
        matchQuery : `
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
          PREFIX text: <http://jena.apache.org/text#>
          PREFIX pf: <http://jena.hpl.hp.com/ARQ/property#>
          PREFIX sf: <http://ldf.fi/similarity-functions#>
          PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
          SELECT ?queryId ?entity (SAMPLE(?l) AS ?label)  (GROUP_CONCAT(DISTINCT ?al;separator=", ") AS ?alabel) (SAMPLE(?sc) AS ?score) {
            { # QUERY
              {
                SELECT ?e (SUM(?s)/COUNT(?s) AS ?sc) {
                  {
                    SELECT ?e {
                      BIND(CONCAT(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(<QUERY>,"([\\\\+\\\\-\\\\&\\\\|\\\\!\\\\(\\\\)\\\\{\\\\}\\\\[\\\\]\\\\^\\\\\\"\\\\~\\\\*\\\\?\\\\:\\\\\\\\])","\\\\\\\\$1"),"^ +| +$", ""),",",""),"\\\\. ","* "),"([^*]) ","$1~0.8 "),"~0.8") AS ?queryTerm)
                      ?e text:query ?queryTerm .
                      ?e a crm:E21_Person .
                    }
                    LIMIT 10
                  }
                  ?e rdfs:label|skos:prefLabel|skos:altLabel ?mlabel .
                  ?str pf:strSplit (<QUERY> " ")
                  BIND(sf:levenshteinSubstring(?str,STR(?mlabel)) AS ?s)
                } GROUP BY ?e
              }
              BIND(<QUERY_ID> AS ?queryId)
              FILTER(BOUND(?e))
            } # /QUERY
            ?e skos:prefLabel ?l .
            ?e <http://emlo.bodleian.ox.ac.uk/schema#ipersonId> ?entity .
            OPTIONAL {
              ?e skos:altLabel ?al .
            }
          }
          GROUP BY ?queryId ?entity
          ORDER BY ?queryId DESC(?score)
        `
      }
      $scope.config = $localStorage.projects[$stateParams.projectId].config
      $scope.state = $localStorage.projects[$stateParams.projectId].state
      this.canceler = $q.defer()
      $scope.importProject = (file:File) => {
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
      $scope.$watch('config',() => {
        $scope.serializedConfiguration = base64.urlencode(JSON.stringify($scope.config))
      },true)
      $scope.$watch('serializedConfiguration',(nv:string,ov:string) => {
        if (nv!=ov && nv!="") $scope.config = JSON.parse(base64.urldecode(nv))
      })
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
