### Arches Consultations Project for python3 release notes

# Testing Script

Before Version Release, go through this checklist to confirm that Consultations-Prj is running as intended.

## Index

| Test Subject   |      Chrome     |      Safari     |     Firefox     |       IE11      | UI                        | Notes                                |
| -------------- | :-------------: | :-------------: | :-------------: | :-------------: | ------------------------- | ------------------------------------ |
| (Test Subject) | (use indicator from list below) | (use indicator from list below) | (use indicator from list below) | (use indicator from list below) | :white_check_mark: (to confirm that the UI has rendered correctly) or :x: (to confirm that the UI failed to render correctly) | (add ticket #, details on bug, etc.) |

When doing a test pass, consider using these status indicators:  
:white_check_mark: = Tested & Approved  
:x: = Merge blocking  
:construction: = Non-blocking bugs  
:ok: = Issue has been fixed  
:question: = Open question  

* * *

## Install

Assigned to:

| Test Subject                                                   | Chrome | Firefox | UI  | Notes |
| -------------------------------------------------------------- | :----: | :----: | :-----: | :--: |
| Confirm that upgrading from the previous release is issue free |:white_check_mark:|:white_check_mark:|:white_check_mark:|   ?   |

* * *

## Active Consultations

Assigned to: 

| Test Subject                                                             | Chrome | Firefox | UI  | Notes |
| ------------------------------------------------------------------------ | :----: | :----: | :-----: | :--: |
| User sort by Log Date (oldest-newest, newest-oldest)                     |:white_check_mark:|    ?   |    ?    |   ?  |
| User sort by Casework Officer (A-Z, Z-A)                                 |:white_check_mark:|    ?   |    ?    |   ?  |
| User sort by Consultation Type (A-Z, Z-A)                                |:white_check_mark:|    ?   |    ?    |   ?  |
| User sort by Consultation Name (A-Z, Z-A)                                |:white_check_mark:|    ?   |    ?    |   ?  |
| User can filter by keyword                                               |:white_check_mark:|    ?   |    ?    |   ?  |
| User (+resource editor privileges) can edit consultation on click        |:white_check_mark:|    ?   |    ?    |   ?  |

* * *

## Workflows

#### Init Workflows

Assigned to: 

| Test Subject                                                             | Chrome | Firefox | UI  | Notes |
| ------------------------------------------------------------------------ | :----: | :----: | :-----: | :--: |
| User can enter a workflow by clicking a workflow icon                    |:white_check_mark:|    ?   |    ?    |   ?  |

* * * 


#### Application Area Workflow

Assigned to: 

| Test Subject                                                             | Chrome | Firefox | UI  | Notes |
| ------------------------------------------------------------------------ | :----: | :----: | :-----: | :--: |
| Step 1: Assign Address - Checking Application Area Name box saves Address as the resource name                       |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 2: Area Map - User can draw, save, and delete polygon, line, and point geoms                                    |   ?   |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can edit and save polygon, line, and point geoms                                             |   ?   |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can edit and update geojson                                                                  |   ?   |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can toggle other basemaps                                                                    |   ?   |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can toggle other overlays                                                                    |   ?   |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can search and find address                                                                  |   ?   |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can navigate map interface using zoom (including zoom-to-features) and pan controls          |   ?   |    ?   |    ?    |   ?  |
| Step 3: Related Heritage - User can select existing and create new Monument resources                                |   ?   |    ?   |    ?    |   ?  |
| Step 3: Related Heritage - User can toggle other basemaps                                                            |   ?   |    ?   |    ?    |   ?  |
| Step 3: Related Heritage - User can toggle other overlays                                                            |   ?   |    ?   |    ?    |   ?  |
| Step 3: Related Heritage - User can search and find address                                                          |   ?   |    ?   |    ?    |   ?  |
| Step 3: Related Heritage - User can navigate map interface using zoom (including zoom-to-features) and pan controls  |   ?   |    ?   |    ?    |   ?  |
| Step 4: Area Description - User can select Description Type and enter text to Description, save                      |   ?   |    ?   |    ?    |   ?  |
| Step 4: Area Description - User can select Designation, save                                                         |   ?   |    ?   |    ?    |   ?  |
| Final Step - User can jump to resource                                                                               |   ?   |    ?   |    ?    |   ?  |
| Final Step - User can start new workflow                                                                             |   ?   |    ?   |    ?    |   ?  |
| All Steps - User can navigate backward and forward already-completed steps                                           |   ?   |    ?   |    ?    |   ?  |
| All Steps - User can Quit to delete workflow resource                                                                |   ?   |    ?   |    ?    |   ?  |
| All Steps - User can Finish to save workflow resource and exit                                                       |   ?   |    ?   |    ?    |   ?  |
                 
* * *

#### Consultation Workflow

Assigned to: 

| Test Subject                                                             | Chrome | Firefox | UI  | Notes |
| ------------------------------------------------------------------------ | :----: | :----: | :-----: | :--: |
| Step 1: Related App. Area - User can select and save App. Area resource(s)                                            |  ?  |    ?   |    ?    |   ?  |
| Step 1: Related App. Area - User can toggle other basemaps                                                            |   ?   |    ?   |    ?    |   ?  |
| Step 1: Related App. Area - User can toggle other overlays                                                            |   ?   |    ?   |    ?    |   ?  |
| Step 1: Related App. Area - User can search and find address                                                          |   ?   |    ?   |    ?    |   ?  |
| Step 1: Related App. Area - User can navigate map interface using zoom (including zoom-to-features) and pan controls  |   ?   |    ?   |    ?    |   ?  |
| Step 1: Related App. Area - Geom onclick: user can append resource via "Relate Application Area"                      |   ?   |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can draw, save, and delete polygon, line, and point geoms                                     |   ?   |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can edit and save polygon, line, and point geoms                                              |   ?   |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can edit and update geojson                                                                   |   ?   |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can toggle other basemaps                                                                     |   ?   |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can toggle other overlays                                                                     |   ?   |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can search and find address                                                                   |   ?   |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can navigate map interface using zoom (including zoom-to-features) and pan controls           |   ?   |    ?   |    ?    |   ?  |
| Step 3: Consultation Dates - User can select Log Date and Target Date independent of each other                       |   ?   |    ?   |    ?    |   ?  |
| Step 4: Consultation Details - User can select concepts for each widget, save                                         |   ?   |    ?   |    ?    |   ?  |
| Step 5: Reference Numbers - User can add new or existing resource for "Agency"                                        |   ?   |    ?   |    ?    |   ?  |
| Step 5: Reference Numbers - User can add, remove Reference Numbers                                                    |   ?   |    ?   |    ?    |   ?  |
| Step 5: Reference Numbers - User can edit Reference Number instance, save edits, and form clears                      |   ?   |    ?   |    ?    |   ?  |
| Step 6: Proposal - User add, save text to Proposal                                                                    |   ?   |    ?   |    ?    |   ?  |
| Step 7: Contacts - User can add new or existing resource(s) in contact widgets                                        |   ?   |    ?   |    ?    |   ?  |
| Final Step - User can jump to resource                                                                                |   ?   |    ?   |    ?    |   ?  |
| Final Step - User can start new workflow                                                                              |   ?   |    ?   |    ?    |   ?  |
| All Steps - User can navigate backward and forward already-completed steps                                            |   ?   |    ?   |    ?    |   ?  |
| All Steps - User can Quit to delete workflow resource                                                                 |   ?   |    ?   |    ?    |   ?  |
| All Steps - User can Finish to save workflow resource and exit                                                        |   ?   |    ?   |    ?    |   ?  |
                 
* * *


#### Site Visit Workflow

Assigned to: 

| Test Subject                                                             | Chrome | Firefox | UI  | Notes |
| ------------------------------------------------------------------------ | :----: | :----: | :-----: | :--: |
| Step 1: Related Consultation - User can select and save related Consultation                  |  ?    |    ?   |    ?    |   ?  |
| Step 1: Related Consultation - User can enter, save Date and Description                      |  ?    |    ?   |    ?    |   ?  |
| Step 2: Site Visit Attendees - User can add new or existing resource for "Attendees"          |  ?    |    ?   |    ?    |   ?  |
| Step 2: Site Visit Attendees - User can select concept for "Role"                             |  ?    |    ?   |    ?    |   ?  |
| Step 2: Site Visit Attendees - User can add, remove Attendees                                 |  ?    |    ?   |    ?    |   ?  |
| Step 2: Site Visit Attendees - User can edit Attendees instance, save edits, and form clears  |  ?    |    ?   |    ?    |   ?  |
| Step 3: Observations - User can text to Observations                                          |  ?    |    ?   |    ?    |   ?  |
| Step 4: Recommendations - User can text to Recommendations                                    |  ?    |    ?   |    ?    |   ?  |
| Step 5: Photos (Upload) - User can upload only 1 photo                                        |  ?    |    ?   |    ?    |   ?  |
| Step 5: Photos (Upload) - User can delete photo                                               |  ?    |    ?   |    ?    |   ?  |
| Step 6: Photos (Edit) - User can Edit Photo ???                                               |  ?    |    ?   |    ?    |   ?  |
| Final Step - User can jump to resource                                                        |   ?   |    ?   |    ?    |   ?  |
| Final Step - User can start new workflow                                                      |   ?   |    ?   |    ?    |   ?  |
| All Steps - User can navigate backward and forward already-completed steps                    |   ?   |    ?   |    ?    |   ?  |
| All Steps - User can Quit to delete workflow resource                                         |   ?   |    ?   |    ?    |   ?  |
| All Steps - User can Finish to save workflow resource and exit                                |   ?   |    ?   |    ?    |   ?  |


* * *


#### Communication Workflow

Assigned to: 

| Test Subject                                                             | Chrome | Firefox | UI  | Notes |
| ------------------------------------------------------------------------ | :----: | :----: | :-----: | :--: |
| Step 1: Related Consultation - User can select and save related Consultation                    |  ?    |    ?   |    ?    |   ?  |
| Step 1: Related Consultation - User can enter, save Date, Type, Subject                         |  ?    |    ?   |    ?    |   ?  |
| Step 1: Related Consultation - User can add new or existing resource(s) for Participants        |  ?    |    ?   |    ?    |   ?  |
| Step 2: Notes - User can add, save text to Notes                                                |  ?    |    ?   |    ?    |   ?  |
| Step 3: Follow-On Actions - User can add, save text to Follow-On Actions                        |  ?    |    ?   |    ?    |   ?  |
| Step 4: Upload Documents - User can upload, add more, delete individually, and delete all files |  ?    |    ?   |    ?    |   ?  | 
| Step 4: Upload Documents - User can filter files by keyword                                     |  ?    |    ?   |    ?    |   ?  | 
| Step 4: Upload Documents - User can change page-count                                           |  ?    |    ?   |    ?    |   ?  | 
| Final Step - User can jump to resource                                                          |   ?   |    ?   |    ?    |   ?  |
| Final Step - User can start new workflow                                                        |   ?   |    ?   |    ?    |   ?  |
| All Steps - User can navigate backward and forward already-completed steps                      |   ?   |    ?   |    ?    |   ?  |
| All Steps - User can Quit to delete workflow resource                                           |   ?   |    ?   |    ?    |   ?  |
| All Steps - User can Finish to save workflow resource and exit                                  |   ?   |    ?   |    ?    |   ?  |

* * *


#### Correspondence Workflow

Assigned to: 

| Test Subject                                                             | Chrome | Firefox | UI  | Notes |
| ------------------------------------------------------------------------ | :----: | :----: | :-----: | :--: |
| Step 1: Related Consultation - User can select and save related Consultation                    |  ?    |    ?   |    ?    |   ?  |
| Step 1: Related Consultation - User can select concept for Letter Type                         |  ?    |    ?   |    ?    |   ?  |
| Final Step - User can download letter                                                          |   ?   |    ?   |    ?    |   ?  |
| Final Step - User can jump to resource                                                          |   ?   |    ?   |    ?    |   ?  |
| Final Step - User can start new workflow                                                        |   ?   |    ?   |    ?    |   ?  |
| All Steps - User can navigate backward and forward already-completed steps                      |   ?   |    ?   |    ?    |   ?  |
| All Steps - User can Quit to delete workflow resource                                           |   ?   |    ?   |    ?    |   ?  |
| All Steps - User can Finish to save workflow resource and exit                                  |   ?   |    ?   |    ?    |   ?  |


* * *

## Functions

Assigned to:

| Test Subject               | Chrome | Firefox | UI  | Notes |
| -------------------------- | :----: | :----: | :-----: | :--: |
| consultation_status_function        |:white_check_mark:|    ?   |    ?    |   ?  |
| bngpoint_to_geojson_function        |  ?  |    ?   |    ?    |   ?  |
| geojson_to_bngpoint_function        |  ?  |    ?   |    ?    |   ?  |


* * * 


## Data Types

Confirm that the user is able to edit the following data types.

Assigned to: 

| Test Subject           | Chrome | Firefox | UI  | Notes |
| ---------------------- | :----: | :----: | :-----: | :--: |
| bngcentrepoint                 |  ?  |    ?   |    ?    |   ?  |

* * *

