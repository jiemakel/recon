# recon
Multipurpose tool for semi-automatic matching of records against a SPARQL endpoint

Use-cases:
 1. associating strong identifiers with entities in CSV files (~reconciliation in OpenRefine)
 1. discovering equivalent entities between two SPARQL endpoints (~ what the SILK tool does)
 1. discovering duplicates in a SPARQL endpoint

A particular design guideline in creating the tool has been to support its use in a digital humanities scenario, where the need for trusted accuracy is paramount, and resources are available for manual verification of all suggestions. Therefore, 1) the automated functionalities of the tool weigh more on the side of recall as opposed to precision, and 2) much tought has been given to the user experience in the manual verification part.
