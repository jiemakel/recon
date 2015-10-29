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
