# Identity resolution

Identity resolution (also known as reconciliation/linking/disambiguation) is the task of attaching strong identifiers sourced from a particular dataset to individuals in another dataset. The two main cases where this is needed are 1) when using data, you need to integrate information from multiple datasets and 2) when you want to make your dataset more easily usable by others (which in the end is just facilitating the former). Concrete scenarios for this are for example sourcing coordinates for places, unifying variously spelled names of people and places or integrating multiple collections dealing with the same topic for unified exploration.

Technically, the workflow also splits into two scenarios: 1) when first transforming a dataset into linked data and 2) when identities need to be mapped between structured datasets.

For this work, there are some ready-made tools available, but in practice, all of these need to be configured. Configurations pertaining to a target dataset may often however be shared. This tutorial is therefore split into two sections. First, there is a section for end-users showing how to use the tools once they have been properly configured. Then, there is a longer section discussing configuration. The person doing the configuration should be both technologically savvy as well as understand the data model of both data sets to be configured.

# 1. Strongly identifying individuals in datasets

When working with data not yet stored as Linked Data, most data processing tools rely on data being available as flat spreadsheets in Excel or [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) format. Luckily, CSV is a standard baseline for flat tabular information, so support for exporting data into CSV is available for most platforms.

After converting your data into CSV, the first tool one can try is [OpenRefine](http://openrefine.org/). In general, OpenRefine is a general tool for [cleaning up](http://freeyourmetadata.org/cleanup/) messy data (e.g. spelling variation in names and keywords). It also has facilities for identity reconciliation. There is a ready tutorial for this at [Free Your Metadata](http://freeyourmetadata.org/reconciliation/).

While OpenRefine is a good tool for simple identity resolution, it also has certain shortcomings. First, its configurability is limited (as evidenced by the above-linked tutorial having to create a special version of LCSH to link against). Second, the interaction flow of OpenRefine is tuned mostly for simple situations where automated matching suffices, and certainty is not so important. For example, OpenRefine only ever shows at most three possible matches, and the interaction for evaluating these matches isn't slick.

For situations where reconciliation accuracy is of utmost importance (e.g. in the digital humanities), the
[Recon](https://github.com/jiemakel/recon) tool provides an alternate workflow. Here, 1) the automated functionalities of the tool weigh more on the side of recall as opposed to precision, and 2) much thought has been given to the user experience in the manual verification part.

In the following, a tutorial on the use of Recon is given. As source data, we will be using a [small dataset](data/Letters.csv) of metadata related to Galileo Galilei's letters, originally part of the [sample data](https://github.com/humanitiesplusdesign/palladio/tree/v1.0.5/apps/palladio/sample%20data) for [Palladio](http://palladio.designhumanities.org/). Our task is to link the places mentioned in this dataset to strong identifiers in [Wikidata](http://www.wikidata.org/) (for example to source coordinates for the places, for eventual visualization in e.g. Palladio).

## 1.1 Mare - getting data ready for Recon

While it would be possible to use the letter sheets directly in Recon, then reconciliation would need to be done multiple times for a single location. Under the assumption that a single string corresponds to a single unique place in the original data, the Mare tool can be used to map and reduce the letter sheet into a place sheet.

Steps:
 1. Go to [Mare](http://jiemakel.github.io/mare/)
 1. Load the letters into Mare
 1. Load the ready-built [configuration](data/Letters-mappings.json)
 1. Save the results.

## 1.2 Recon

Steps:
 1. Go to [Recon](http://jiemakel.github.io/recon/)
 1. Create a new project
 1. Load the ready-built [configuration](../examples/wikidata-places.json)
 1. Return to the main project view and load the [place CSV](data/Letter-places.csv) you created in Mare
 1. Reconcile following these [instructions](https://github.com/jiemakel/recon/blob/master/README.md) from the homepage of the tool
 1. Save the reconciled file as a CSV with identifiers

# 2. Resolving identities between strong identifiers

For resolving identities between two vocabularies already stored as linked data, there is a ready [tutorial](https://joinup.ec.europa.eu/community/semic/document/tutorial-use-silk-aligning-controlled-vocabularies) for the [Silk](http://silkframework.org/) system.

[Recon](https://github.com/jiemakel/recon) also supports identity resolution between SPARQL endpoints. To reproduce the above tutorial in Recon, load the following ready built [configuration](../examples/lc-countries.json), which is configured to resolve names against the Library of Congress countries authority. After that, go to the main project view, and click on ''Load SPARQL''. Enter ''http://ldf.fi/identity-resolution-demo/sparql'' as the SPARQL endpoint, and paste the following as the load query, which will load all the European country authority entries into Recon:
```
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT ?label ?id {
  GRAPH <http://publications.europa.eu/mdr/resource/authority/country/> {
    ?id skos:prefLabel ?label .
    FILTER(LANG(?label)="en")
  }
}
```

Experiment with the resolution flow of Recon, and particularly contrast resolving entries at the beginning of the EU list (which are for the most part current countries and are resolved easily in the LC authority) with those at the end of the list (which are mostly dissolved countries or minor territories). Contrast also to the workflow in Silk.

# Available datasets for identity resolution

While the above tools allow you to link entities, the real question is finding useful data sources to link against. Here, two considerations are apparent. First, maximum interlinking is achieved when linking against data sources that others also link against. Here, it is useful to select sources that have behind as wide a community as possible, as well as as veritable an authority as possible. However, this needs to be balanced against coverage - it is desirable to select sources that adequately cover your domain.

The second consideration regards usefulness. Data should be linked against sources that provide useful additional information (e.g. birth dates or occupations for people in a dataset, or coordinates for places).

The following lists prominent generally available data sources against which datasets can be reconciled, along with some notes on the additional information that can be gained from them.

* General
  * [DBpedia](http://dbpedia.org/)
    * Structured information extracted from Wikipedia infoboxes
  * [Wikidata](https://www.wikidata.org/)
      * Structured information on 14 million Wikipedia entities
* People and organizations
  * [Virtual International Authority File (VIAF)](http://viaf.org/)
    * Joins together authority files of over 45 national libraries and other institutions
    * "Anyone who has ever published anything that is in any of the catalogues of the participating libraries"
    * 2014/02: 50 million names for 19 million entities
    * 2015/05: 274 million names for 79 million entities
    * Some birth/death date information
    * Automatic conversions from "Lastname, Firstname" to “Firstname Lastname” does not always work due to bad data
  * [Getty Union List of Artist Names (ULAN)](http://www.getty.edu/research/tools/vocabularies/ulan/index.html)
    * 600 000 artists
    * Names, birth/death dates, education, occupation, relationships
  * [Consortium of European Research Libraries Thesaurus (CERL)](http://thesaurus.cerl.org/cgi-bin/record.pl?rid=cnp01317268)
    * Place name and personal names in Europe in the period of hand press printing (1450 - c. 1830)
    * 900 000 names for people, 20 000 place names
    * Names, biographical dates, activities, publications
* Places
  * [GeoNames](http://www.geonames.org/)
    * 10 million names for 9 million modern places
  * [Pleiades](http://pleiades.stoa.org/) (~35 000 ancient places)
  * [Getty Thesaurus of Geographic Names (TGN)](http://www.getty.edu/research/tools/vocabularies/tgn/index.html)
    * 2 million names for 1,4 million modern and historical places
  * National gazetteers
    * [Historical Gazetteer of England’s Place-Names](http://www.placenames.org.uk/browse/mads/epns-deep-55-hu-subcounty-000001)
    * [PNR](http://www.ldf.fi/dataset/pnr/index.html)
* Publication information
  * [Deutsche Nationalbibliografie (DNB)](http://www.dnb.de/EN/Service/DigitaleDienste/DNBBibliografie/dnbbibliografie_node.html)
  * [Bibliographie nationale française (BNF)](http://bibliographienationale.bnf.fr/)
  * [British National Bibliography (BNB)](http://bnb.bl.uk/)
  * [Early English Books Online (EEBO)](http://www.textcreationpartnership.org/tcp-eebo/) (1475-1700)
  * [Eighteenth Century Collectons Online (ECCO)](http://www.textcreationpartnership.org/tcp-ecco/)
  * OCLC [WorldCat](https://www.oclc.org/worldcat.en.html): 305 million books from OCLC member libraries
* Other data
  * Getty Cultural Objects Name Authority ([CONA](http://www.getty.edu/research/tools/vocabularies/cona/))
  * Gallery and museum databases, e.g. [British Museum](http://collection.britishmuseum.org/), [Finnish National Gallery](http://kokoelmat.fng.fi/api/v2support/docs/#/overview), [Europeana](http://europeana.eu/),  [Digital Public Library of America](http://dp.la/)
  * Wikidata, DBpedia
  * Domain-specific vocabularies such as [WW1LOD](http://ldf.fi/ww1lod/)

# Configuring identity resolution - example SPARQL queries

As said, developing an identity resolution configuration against a particular dataset always demands intimate knowledge of both the dataset, as well as the details of the particular tool being configured.

Thus, it is impossible to give general instructions for this. In place of such, in the following are multiple SPARQL queries that have been used in identity resolution against particular endpoints.

## Resolution of First World War entities against multiple endpoints

```
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX rdve3: <http://rdvocab.info/ElementsGr3/>
SELECT ?id (?mngram AS ?label) ?ngram ?source {
  {
    VALUES ?ngram {
      <VALUES>
    }
    BIND(REPLACE(REPLACE(?ngram,"\\W*$",""),"^\\W*","") AS ?ngram2)
    FILTER(STRLEN(?ngram2)>2)
    {
      BIND(?ngram2 AS ?mngram)
      ?c skos:prefLabel|skos:altLabel ?mngram .
    } UNION {
      BIND(LCASE(?ngram2) AS ?mngram)
      ?c skos:prefLabel|skos:altLabel ?mngram .
    } UNION {
      BIND(CONCAT(UCASE(SUBSTR(?ngram2,1,1)),SUBSTR(?ngram2,2)) AS ?mngram)
      ?c skos:prefLabel|skos:altLabel ?mngram .
    } UNION {
      BIND(STRLANG(?ngram2,"en") AS ?mngram)
      ?c skos:prefLabel|skos:altLabel ?mngram .
    } UNION {
      BIND(STRLANG(LCASE(?ngram2),"en") AS ?mngram)
      ?c skos:prefLabel|skos:altLabel ?mngram .
    } UNION {
      BIND(STRLANG(CONCAT(UCASE(SUBSTR(?ngram2,1,1)),SUBSTR(?ngram2,2)),"en") AS ?mngram)
      ?c skos:prefLabel|skos:altLabel ?mngram .
    }
    ?c (owl:sameAs|^owl:sameAs|skos:exactMatch|^skos:exactMatch)* ?id .
    BIND(1 AS ?source)
  } UNION {
  SERVICE <http://ldf.fi/ww1/sparql> {
    SELECT ?mngram ?ngram ?id {
      VALUES ?ngram {
          <VALUES>
      }
        BIND(REPLACE(REPLACE(?ngram,"\\W*$",""),"^\\W*","") AS ?ngram2)
        FILTER(STRLEN(?ngram2)>2)
        {
      BIND(?ngram2 AS ?mngram)
      ?c skos:prefLabel|skos:altLabel|rdfs:label|rdve3:preferredNameForTheEvent|foaf:name ?mngram
    } UNION {
      BIND(LCASE(?ngram2) AS ?mngram)
      ?c skos:prefLabel|skos:altLabel|rdfs:label ?mngram
    } UNION {
      BIND(CONCAT(UCASE(SUBSTR(?ngram2,1,1)),SUBSTR(?ngram2,2)) AS ?mngram)
      ?c skos:prefLabel|skos:altLabel|rdfs:label ?mngram
    } UNION {
      BIND(STRLANG(?ngram2,"en") AS ?mngram)
        ?c skos:prefLabel|skos:altLabel|rdfs:label ?mngram
    } UNION {
      BIND(STRLANG(LCASE(?ngram2),"en") AS ?mngram)
      ?c skos:prefLabel|skos:altLabel|rdfs:label ?mngram
    } UNION {
      BIND(STRLANG(CONCAT(UCASE(SUBSTR(?ngram2,1,1)),SUBSTR(?ngram2,2)),"en") AS ?mngram)
      ?c skos:prefLabel|skos:altLabel|rdfs:label ?mngram
    }
    ?c (owl:sameAs|^owl:sameAs|skos:exactMatch|^skos:exactMatch)* ?id .
    }
    }
  BIND(IF(STRSTARTS(STR(?id),"http://rdf.canadiana.ca/PCDHN-LOD/"),2,IF(STRSTARTS(STR(?id),"http://data.aim25.ac.uk/"),3,5)) AS ?source)  
  } UNION {
  SERVICE <http://ldf.fi/dbpedia/sparql> {
    SELECT ?mngram ?ngram ?id {
      VALUES ?ngram {
          <VALUES>
      }
        BIND(REPLACE(REPLACE(?ngram,"\\W*$",""),"^\\W*","") AS ?ngram2)
        FILTER(STRLEN(?ngram2)>2)
    BIND(STRLANG(?ngram2,"en") AS ?mngram)
    ?c rdfs:label ?mngram .
    FILTER(STRSTARTS(STR(?c),"http://dbpedia.org/resource/"))
    FILTER(!STRSTARTS(STR(?c),"http://dbpedia.org/resource/Category:"))
    FILTER EXISTS { ?c a ?type }
    FILTER NOT EXISTS {
      ?c dbo:wikiPageDisambiguates ?other .
    }
    FILTER NOT EXISTS {
      ?c a dbo:Album .
    }
    {
      ?c dbo:wikiPageRedirects ?id .
    } UNION {
      FILTER NOT EXISTS {
      ?c dbo:wikiPageRedirects ?other .
      }
      BIND(?c as ?id)
      }
      }
    }
    BIND(4 AS ?source)
  }
}
```

## General reconciliation against DBpedia (filtering out album names that often match very general words)

```
PREFIX text: <http://jena.apache.org/text#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dbo: <http://dbpedia.org/ontology/>
SELECT ?id ?label ?ngram {
  VALUES ?ngram {
    <VALUES>
  }
  BIND(CONCAT('"',?ngram,'"') AS ?qstring)
  ?id text:query ?qstring .
  ?id rdfs:label ?label .
  FILTER(LCASE(STR(?label))=LCASE(STR(?ngram)))
    FILTER(!STRSTARTS(STR(?id),"http://dbpedia.org/resource/Category:"))
    FILTER EXISTS { ?id a ?type }
    FILTER NOT EXISTS {
      ?id a dbo:Album .
    }
}

```

## Resolution against multiple Finnish law vocabularies

```
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX dbpfi: <http://fi.dbpedia.org/resource/>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
SELECT ?id ?label ?ngram ?source {
  {
    VALUES ?ngram {
      <VALUES>
    }
    {
      BIND(STRLANG(CONCAT(UCASE(SUBSTR(?ngram,1,1)),LCASE(SUBSTR(?ngram,2))),<LANG>) AS ?ungram)
      ?id skos:prefLabel ?ungram .
      BIND(?ungram AS ?label)
    } UNION {
      BIND(STRLANG(LCASE(?ngram),<LANG>) AS ?lngram)
      ?id skos:prefLabel ?lngram .
      BIND(?lngram AS ?label)
    } UNION {
      BIND(STRLANG(CONCAT(UCASE(SUBSTR(?ngram,1,1)),LCASE(SUBSTR(?ngram,2))),<LANG>) AS ?ungram)
      ?id2 skos:prefLabel ?ungram .
      ?id owl:equivalentClass ?id2 .
      BIND(?ungram AS ?label)
    } UNION {
      BIND(STRLANG(LCASE(?ngram),<LANG>) AS ?lngram)
      ?id2 skos:prefLabel ?lngram .
      ?id owl:equivalentClass ?id2 .
      BIND(?lngram AS ?label)
    }
    BIND(IF(STRSTARTS(STR(?id),"http://www.yso.fi/onto/laki/"),1,IF(STRSTARTS(STR(?id),"http://ldf.fi/ttp/"),2,0)) AS ?source)
    FILTER(?source!=0)
    FILTER EXISTS {
      ?id rdfs:comment ?d
    }
    # QUERY
  } UNION {
    SERVICE <http://ldf.fi/dbpedia-fi/sparql> {
      SELECT ?id ?label ?ngram ?source {
        VALUES ?ngram {
          <VALUES>
        }
        BIND(STRLANG(CONCAT(UCASE(SUBSTR(?ngram,1,1)),LCASE(SUBSTR(?ngram,2))),<LANG>) AS ?label)
        ?id rdfs:label ?label .
        ?id dct:subject/skos:broader* dbpfi:Luokka:Oikeustiede .
        # QUERY
        BIND(3 AS ?source)
      }
    }
  }
}
```

## Recon query for resolution against people in Early Modern Letters Online, with warnings for people who died before or were born after an associated date

```
PREFIX text: <http://jena.apache.org/text#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX actors: <http://ldf.fi/warsa/actors/>
PREFIX atypes: <http://ldf.fi/warsa/actors/actor_types/>
SELECT ?id ?label ?ngram
WHERE
{
  VALUES ?ngram {
    <VALUES>
  }
  FILTER(STRLEN(?ngram)>2 && UCASE(SUBSTR(?ngram,1,1))=SUBSTR(?ngram,1,1))
  BIND(CONCAT('"',REPLACE(?ngram,"([\\+\\-\\&\\|\\!\\(\\)\\{\\}\\[\\]\\^\\\"\\~\\*\\?\\:\\/\\\\])","\\\\$1"),'"') AS ?qstring)
  GRAPH <http://ldf.fi/warsa/actors> { ?id text:query ?qstring . }
  ?id a/rdfs:subClassOf* atypes:MilitaryUnit .
  ?id rdfs:label|skos:prefLabel|skos:altLabel ?label .
  FILTER(LCASE(STR(?label))=LCASE(STR(?ngram)))
}
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
                      BIND(REPLACE(REPLACE(REPLACE(REPLACE(<QUERY>,"([\\+\\-\\&\\|\\!\\(\\)\\{\\}\\[\\]\\/\\^\\\"\\~\\*\\?\\:\\\\])","\\\\$1"),"^ +| +$", ""),",",""),"\\. ","* ") AS ?escapedQuery)
                      BIND(CONCAT("(",?escapedQuery,") OR (",REPLACE(?escapedQuery,"([^*]) +","$1~0.8 "),"~0.8)") AS ?queryTerm)
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
```

## Recon query for resolution against places in Early Modern Letters Online

```
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX text: <http://jena.apache.org/text#>
PREFIX pf: <http://jena.hpl.hp.com/ARQ/property#>
PREFIX sf: <http://ldf.fi/similarity-functions#>
PREFIX crm: <http://www.cidoc-crm.org/cidoc-crm/>
PREFIX emlos: <http://emlo.bodleian.ox.ac.uk/schema#>
SELECT ?queryId ?entity (SAMPLE(?l) AS ?label)  (GROUP_CONCAT(DISTINCT ?al;separator=", ") AS ?alabel) (GROUP_CONCAT(DISTINCT ?pl;separator=", ") AS ?plabel) (SAMPLE(?sc) AS ?score) (SAMPLE(?url) AS ?link) {
            { # QUERY
              {
                SELECT ?e (SUM(?s)/COUNT(?s) AS ?sc) {
                  {
                    SELECT ?e {
                      BIND(REPLACE(REPLACE(REPLACE(REPLACE(<QUERY>,"([\\+\\-\\&\\|\\!\\(\\)\\{\\}\\[\\]\\^\\\"\\~\\*\\?\\:\\\\])","\\\\$1"),"^ +| +$", ""),",",""),"\\. ","* ") AS ?escapedQuery)
                      BIND(CONCAT("(",?escapedQuery,") OR (",REPLACE(?escapedQuery,"([^*]) +","$1~0.8 "),"~0.8)") AS ?queryTerm)
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
```
