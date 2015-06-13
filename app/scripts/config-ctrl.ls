angular.module("app").controller "ConfigCtrl", ($scope,$localStorage,$q,sparql) ->
  if !$localStorage.config then $localStorage.config = {
    sparqlEndpoint : void
    pageSize : 40
    matchQuery : '''
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX text: <http://jena.apache.org/text#>
      PREFIX pf: <http://jena.hpl.hp.com/ARQ/property#>
      PREFIX sf: <http://ldf.fi/similarity-functions#>
      SELECT ?entity (SAMPLE(?l) AS ?label) (GROUP_CONCAT(?s;separator=', ') AS ?synonyms) (SUM(?s)/COUNT(?s) AS ?score) {
        {
          SELECT ?entity {
            VALUES (?index ?queryTerm) {
              (<QUERIES>)
            }
            BIND(CONCAT(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(?queryTerm,"([\\\\+\\\\-\\\\&\\\\|\\\\!\\\\(\\\\)\\\\{\\\\}\\\\[\\\\]\\\\^\\\\\\"\\\\~\\\\*\\\\?\\\\:\\\\\\\\])","\\\\\\\\$1"),"^ +| +$", ""),",",""),"\\\\. ","* "),"([^*]) ","$1~0.8 "),"~0.8") AS ?fuzzyQueryTerm)
            ?entity text:query ?fuzzyQueryTerm .
          }
        }
        ?entity rdfs:label|skos:prefLabel|skos:altLabel ?mlabel .
        ?str pf:strSplit (?queryTerm " ")
        BIND(sf:levenshteinSubstring(?str,STR(?mlabel)) AS ?s)
        ?entity skos:prefLabel ?l .
        ?entity skos:altLabel ?s .
      }
      GROUP BY ?entity
      ORDER BY DESC(?score)
    '''
    longDescriptionQuery : '''
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      SELECT ?entity ?property ?value {
        VALUES ?entity {
          <ENTITIES>
        }
        ?entity ?property ?v .
        {
          FILTER(ISLITERAL(?v))
          BIND(?v AS ?value)
        } UNION {
          ?v rdfs:label|skos:prefLabel ?value .
        }
      }
    '''
  }
  $scope.config = $localStorage.config
  canceller = void
  $scope.$watch 'config.sparqlEndpoint', (nv,ov) !-> if nv?
    if canceller? then canceller.resolve!
    canceller := $q.defer!
    $scope.sparqlEndpointOK <-! sparql.check(nv,{timeout:canceller.promise}).then _
