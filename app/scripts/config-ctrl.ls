angular.module("app").controller "ConfigCtrl", ($scope,$localStorage,$q,sparql,base64) ->
  if !$localStorage.config then $localStorage.config = {
    sparqlEndpoint : void
    pageSize : 15
    matchQuery : '''
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
        ?e <http://ldf.fi/emlo/schema#ipersonId> ?entity .
        OPTIONAL {
          ?e skos:altLabel ?al .
        }
      }
      GROUP BY ?queryId ?entity
      ORDER BY ?queryId DESC(?score)
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
  $scope.serialize = ->
    base64.urlencode(JSON.stringify($localStorage.config))
  $scope.$watch 'config.sparqlEndpoint', (nv,ov) !-> if nv?
    if canceller? then canceller.resolve!
    canceller := $q.defer!
    $scope.sparqlEndpointOK <-! sparql.check(nv,{timeout:canceller.promise}).then _
