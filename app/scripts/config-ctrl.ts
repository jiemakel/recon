module app {
  export interface IConfigureScope extends angular.IScope {
    config : IConfiguration
    sparqlEndpointOK : boolean
    serialize : () => string
  }

  export interface IConfiguration {
    sparqlEndpoint : string,
    pageSize : number,
    matchQuery : string
  }

  export interface IConfigStorage {
    config : IConfiguration
  }

  export interface IBase64Service {
    urlencode : (str : string) => string
    urldecode : (str : string) => string
  }

  export class ConfigureController {

    private canceler : angular.IDeferred<{}>
    constructor($scope: IConfigureScope,$localStorage:IConfigStorage,$q:angular.IQService,sparqlService:SparqlService,base64:IBase64Service) {
      if (!$localStorage.config) $localStorage.config = {
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
      $scope.config = $localStorage.config
      $scope.serialize = () => base64.urlencode(JSON.stringify($localStorage.config))
      this.canceler = $q.defer()
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
