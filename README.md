# recon

Multipurpose tool for semi-automatic matching of records against a SPARQL endpoint

Use-cases:
 1. associating strong identifiers with entities in CSV files (~reconciliation in OpenRefine)
 1. discovering equivalent entities between two SPARQL endpoints (~ what the SILK tool does)
 1. discovering duplicates in a SPARQL endpoint

A particular design guideline in creating the tool has been to support its use in a digital humanities scenario, where the need for trusted accuracy is paramount, and resources are available for manual verification of all suggestions. Therefore, 1) the automated functionalities of the tool weigh more on the side of recall as opposed to precision, and 2) much tought has been given to the user experience in the manual verification part.

## Using Recon

Work in Recon is organized in projects, each of which is tied to 1) a particular data set to be reconciled and 2) to a particular identity resolver configuration (which can often be the same between projects if you are resolving similar entities against a common external vocabulary). 

## Creating a new project

The [main page](http://jiemakel.github.io/recon/) of Recon lists all open projects, along with information on how far they are into completion. A new project can be created merely by typing a project name to the text box displayed and pressing enter. For a new project, this will take you to the configuration view. If you are an end user, you should have a ready project configuration file available. To load this, you should click on **Import project**, which will populate the configuration information for you, and allow you to move to the main project view by clicking on **Return to project**. 

At this point, you are ready to load data into your project. Depending on your use case, tap on either the **Load CSV** button or the **Load SPARQL** button to import your dataset into Recon.

## Working on a project

The main project view of Recon is organized into two columns. On the left are all entries in the data set to be reconciled, divided into pages (as a sidenote, the number of entries per page can be set in the configuration view. You should set it to fit a maximum of entries per page without the need for scrolling). On the right at the top are shown details of the currently selected entity. Below that is a table listing potential matches returned from the reconciliation endpoint, along with information on them as defined in the configuration.

The first nine of these potential matches are numbered, and the reconciliation match can be selected simply by pressing that number key on the keyboard. Any of the items can also be selected by clicking on its name or number.

After selection, the interface marks the resolved entity with a green border, and automatically shifts focus onto the next item in the dataset, allowing for a speedy reconciliation process.

If a mistake is made, the user can return to the previous entry by pressing **shift+tab** on the keyboard, or by selecting the entity to be corrected using the mouse (one can also move forward in the entity list by just pressing **tab**). Mousing over a reconciled entity also shows the name of the entity it was resolved against for quick verification in case of doubt.

If an entity does not have any matches in the reconciliation database, the user should select ''0'' to mark it as such. This will turn the entry border yellow in the list on the left, to distinguish it from the red of unhandled entries. 

The user interface also tracks overall progress in the dataset by a progress bar appearing at the bottom of the left column. This same progress bar also appears in the [main page](http://jiemakel.github.io/recon/) project list view.

## Migrating a project between web browsers or computers

All the data of a project resides in the local storage of the web browser used. Thus, to work on a project on a different computer or browser, the project must be exported from the original and imported into the new environment. This can be done in the project configuration view (which is available by clicking **Configure** in the main project view). Once in the project view, the project can be exported by clicking on **Export project**. The resulting json file can then be copied to the new environment, and imported there (by navigating to the [main page](http://jiemakel.github.io/recon/) on the new browser, creating a new project there and then by clicking on the **Import project** button).

## Exporting project data 

Once a project has been completely reconciled (or at any time in between), its reconciliation data can be exported from the project by clicking on the **Export CSV** button on the main project page. This will download the project data as a CSV file with the reconciliation database ids occupying the second column.

If desired, the project can then be deleted from the configuration view by clicking on **Delete project**, or reused for another dataset by just loading new data into it.

## Configuring a new reconciliation endpoint into Recon 

(not for end-users, only for those needing to do so)

A Recon endpoint configuration consists of a SPARQL endpoint and a match query template. Two quite complete examples of such configurations are given in the examples folder of the project, and repeated here:

### EMLO places

This configuration is used by the EMLO project to strongly identify places. The complete query template is as follows:

    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX text: <http://jena.apache.org/text#>
    PREFIX pf: <http://jena.hpl.hp.com/ARQ/property#>
    PREFIX sf: <http://ldf.fi/similarity-functions#>
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX emlos: <http://emlo.bodleian.ox.ac.uk/schema#>
    SELECT ?queryId ?entity (SAMPLE(?l) AS ?label)  (GROUP_CONCAT(DISTINCT ?al;separator=", ") AS ?alabel) (SAMPLE(?sc) AS ?score) (SAMPLE(?url) AS ?link) {
      { # QUERY
        {
          SELECT ?e (SUM(?s)/COUNT(?s) AS ?sc) {
            {
              SELECT ?e {
                BIND(REPLACE(REPLACE(REPLACE(REPLACE(<QUERY>,"([\\+\\-\\&\\|\\!\\(\\)\\{\\}\\[\\]\\^\\\"\\~\\*\\?\\:\\\\])","\\\\$1"),"^ +| +$", ""),", *"," "),"\\. ","* ") AS ?escapedQuery)
                BIND(CONCAT("(",?escapedQuery,") OR (",REPLACE(?escapedQuery,"([^*]) +","$1~ "),"~)") AS ?queryTerm)
                ?e text:query ?queryTerm .
                ?e a/rdfs:subClassOf* crm:E53_Place .
              }
              LIMIT 30
            }
            ?e rdfs:label|skos:prefLabel|skos:altLabel ?mlabel .
            ?str pf:strSplit (<QUERY> " ")
            BIND(sf:levenshteinSubstring(?str,STR(?mlabel)) AS ?s)
          } GROUP BY ?e
        }
        BIND(<QUERY_ID> AS ?queryId)
        FILTER(BOUND(?e))
      } # /QUERY
      ?e rdfs:label ?l .
      ?e emlos:placeId ?entity .
      OPTIONAL {
        ?e skos:altLabel ?al .
      }
      BIND(CONCAT('<a href="https://emlo-edit.bodleian.ox.ac.uk/interface/union.php?class_name=location&method_name=one_location_search_results&location_id=',?entity,'&opening_method=db_search_results" target="_blank">[o]</a>') AS ?url)
    }
    GROUP BY ?queryId ?entity
    ORDER BY ?queryId DESC(?score)
        
Here, the lines between `# QUERY` and `# /QUERY` are the part that is responsible for discovering matches. In actually issuing the query, Recon duplicates this part for each of the dataset entries on a particular page inside UNION clauses. Recon uses the assignment `BIND(<QUERY_ID> AS ?queryId)` to differentiate between these queries in the response.

In this example, the matching is made based on a [Jena text query](https://jena.apache.org/documentation/query/text-query.html). Being based on Lucene, jena-text uses its [query syntax](https://lucene.apache.org/core/5_3_1/queryparser/org/apache/lucene/queryparser/classic/package-summary.html#Overview). This in turn necessitates the first complex replace operation, which escapes all special characters Lucene would otherwise interpret as query instructions. After this, further processing is done to better handle names of the form `Oxford, Oxfordshire, Eng.`. Finally, the whole query is replicated as a fuzzy query in order to guarantee that all possibly relevant matches are indeed returned.

Upon receiving a match from Lucene, the matches are scored not on the Lucene TF-IDF score, but on a more applicable custom Levenshtein sub-string measure. 

Outside the core query selection block, additional information pertaining to the matched entities is gathered. Here, these include the primary and alternate labels for the place, as well as a link to view the place in the primary EMLO editor interface (this also shows how the results returned can contain arbitrary HTML). Any additional information desired can be gathered just by adding new variables to the `SELECT` clause. 

### EMLO people

This configuration is used by the EMLO project to strongly identify people. The complete query template is as follows:

    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX text: <http://jena.apache.org/text#>
    PREFIX pf: <http://jena.hpl.hp.com/ARQ/property#>
    PREFIX sf: <http://ldf.fi/similarity-functions#>
    PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
    PREFIX emlos: <http://emlo.bodleian.ox.ac.uk/schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    SELECT ?queryId ?entity (SAMPLE(?l) AS ?label)  (GROUP_CONCAT(DISTINCT ?al;separator=", ") AS ?alabel) (CONCAT(MAX(?bwarning),MAX(?dwarning)) AS ?warning) (GROUP_CONCAT(DISTINCT ?pl;separator=", ") AS ?plabel) (MAX(?sc) AS ?score) (SAMPLE(?url) AS ?link) {
      { # QUERY
        {
          SELECT ?e ?mlabel (SUM(?s)/COUNT(?s) AS ?sc) {
            {
              SELECT ?e {
                BIND(REPLACE(REPLACE(REPLACE(REPLACE(<QUERY>,"([\\+\\-\\&\\|\\!\\(\\)\\{\\}\\[\\]\\/\\^\\\"\\~\\*\\?\\:\\\\])","\\\\$1"),"^ +| +$", ""),", *"," "),"\\. ","* ") AS ?escapedQuery)
                BIND(CONCAT("(",?escapedQuery,") OR (",REPLACE(?escapedQuery,"([^*]) +","$1~ "),"~)") AS ?queryTerm)
                ?e text:query ?queryTerm .
                ?e a crm:E21_Person .
              }
              LIMIT 30
            }
            ?e rdfs:label|skos:prefLabel|skos:altLabel ?mlabel .
            ?str pf:strSplit (<QUERY> " ")
            BIND(sf:levenshteinSubstring(?str,STR(?mlabel)) AS ?s)
          } GROUP BY ?e ?mlabel
        }
        BIND(<QUERY_ID> AS ?queryId)
        FILTER(BOUND(?e))
    	  OPTIONAL {
    		    ?e emlos:deathDate/crm:P82b_end_of_the_end ?dd .
              BIND(IF(STRDT(<CELL_1>,xsd:integer)>YEAR(?dd),"Died before! ","") AS ?dwarning)
    	  }
    	  OPTIONAL {
    		    ?e emlos:birthDate/crm:P82a_begin_of_the_begin ?bd .
              BIND(IF(YEAR(?bd)>STRDT(<CELL_2>,xsd:integer),"Wasn't born! ","") AS ?bwarning)
    	  }
      } # /QUERY
      ?e skos:prefLabel ?l .
      ?e emlos:ipersonId ?entity .
      OPTIONAL {
        ?e ((^emlos:cofk_union_relationship_type-was_addressed_to/emlos:cofk_union_relationship_type-was_sent_to)|(emlos:cofk_union_relationship_type-created/emlos:cofk_union_relationship_type-was_sent_from))/skos:prefLabel ?pl .
      }
      OPTIONAL {
        ?e skos:altLabel ?al .
      }
      BIND(CONCAT('<a href="https://emlo-edit.bodleian.ox.ac.uk/interface/union.php?class_name=person&method_name=one_person_search_results&iperson_id=',?entity,'&opening_method=db_search_results" target="_blank">[o]</a>') AS ?url)
    }
    GROUP BY ?queryId ?entity
    ORDER BY ?queryId DESC(?score)

Here, the core query is much the same, but in sourcing additional information, new functionalities are also used. First, in ?plabel, the query gathers all places associated with the person for aiding in disambiguation. More importantly however, the query makes use of possible additional information in the spreadsheet. Specifically, if the original spreadsheet ingested contains after the name two fields specifying the activity period (from,to) of the person (e.g. from letter dates), the query compares these with the birth and death dates of the candidate. If the constraints specified in the query are not met, warnings are generated to be passed on to the selector UI in Recon.
