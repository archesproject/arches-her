### Arches Consultations Project for python3 release notes

# Testing Script

Before Version Release, go through this checklist to confirm that Consultations-Prj is running as intended.

## Index

| Test Subject   |      Chrome     |     Firefox     | UI                        | Notes                                |
| -------------- | :-------------: | :-------------: | ------------------------- | ------------------------------------ |
| (Test Subject) | (use indicator from list below) | (use indicator from list below) | :white_check_mark: (to confirm that the UI has rendered correctly) or :x: (to confirm that the UI failed to render correctly) | (add ticket #, details on bug, etc.) |

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
| Confirm that upgrading from the previous release is issue free |:white_check_mark:|  ? |  ?  |   ?   |

* * *

## Menu Items

Assigned to:

| Test Subject                                                   | Chrome | Firefox | UI  | Notes |
| -------------------------------------------------------------- | :----: | :----: | :-----: | :--: |
| Active Consultations takes user to Active Consultations        |:white_check_mark:|  ? |  ?  |   ?   |
| New takes user to Initialize Workflow                          |:white_check_mark:|  ? |  ?  |   ?   |
| Find takes user to Search                                      |:white_check_mark:|  ? |  ?  |   ?   |
| Dashboards takes user to ???                                   |  ?  |  ? |  ?  |   ?   |
| Manage takes user to Core Arches Resource Manager, Core Arches nav-bar (permission level?)  |  ?  |  ? |  ?  |   ?   |
| Help takes user to ???                                         |  ?  |  ? |  ?  |   ?   |
| About takes user to ???                                        |  ?  |  ? |  ?  |   ?   |
| Clicking Consultations in top-left corner collapses nav        |:white_check_mark:|  ? |  ?  |   ?   |

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
| User (+resource editor privileges) can edit consultation on click        |  ?  |    ?   |    ?    |   ?  |

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
| Step 2: Area Map - User can draw, save, and delete polygon, line, and point geoms                                    |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 2: Area Map - User can edit and save polygon, line, and point geoms                                             |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 2: Area Map - User can edit and update geojson                                                                  |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 2: Area Map - User can toggle other basemaps                                                                    |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 2: Area Map - User can toggle other overlays                                                                    |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 2: Area Map - User can search and find address                                                                  |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 2: Area Map - User can navigate map interface using zoom (including zoom-to-features) and pan controls          |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 3: Related Heritage - User can select existing and create new Monument resources                                |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 3: Related Heritage - User can toggle other basemaps                                                            |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 3: Related Heritage - User can toggle other overlays                                                            |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 3: Related Heritage - User can search and find address                                                          |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 3: Related Heritage - User can navigate map interface using zoom (including zoom-to-features) and pan controls  |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 4: Area Description - User can select Description Type and enter text to Description, save                      |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 4: Area Description - User can select Designation, save                                                         |:white_check_mark:|    ?   |    ?    |   ?  |
| Final Step - User can jump to resource                                                                               |:white_check_mark:|    ?   |    ?    |   ?  |
| Final Step - User can start new workflow                                                                             |:white_check_mark:|    ?   |    ?    |   ?  |
| All Steps - User can navigate backward and forward already-completed steps                                           |:white_check_mark:|    ?   |    ?    |   ?  |
| All Steps - User can Quit to delete workflow resource                                                                |:white_check_mark:|    ?   |    ?    |   ?  |
| All Steps - User can Finish to save workflow resource and exit                                                       |:white_check_mark:|    ?   |    ?    |   ?  |
                 
* * *

#### Consultation Workflow

Assigned to: 

| Test Subject                                                             | Chrome | Firefox | UI  | Notes |
| ------------------------------------------------------------------------ | :----: | :----: | :-----: | :--: |
| Step 1: Related App. Area - User can select and save App. Area resource(s)                                            |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 1: Related App. Area - User can toggle other basemaps                                                            |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 1: Related App. Area - User can toggle other overlays                                                            |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 1: Related App. Area - User can search and find address                                                          |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 1: Related App. Area - User can navigate map interface using zoom (including zoom-to-features) and pan controls  |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 1: Related App. Area - Geom onclick: user can append resource via "Relate Application Area"                      |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can draw, save, and delete polygon, line, and point geoms                                     |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can edit and save polygon, line, and point geoms                                              |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can edit and update geojson                                                                   |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can toggle other basemaps                                                                     |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can toggle other overlays                                                                     |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can search and find address                                                                   |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 2: Area Map - User can navigate map interface using zoom (including zoom-to-features) and pan controls           |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 3: Consultation Dates - User can select Log Date and Target Date independent of each other                       |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 4: Consultation Details - User can select concepts for each widget, save                                         |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 5: Reference Numbers - User can add new or existing resource for "Agency"                                        |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 5: Reference Numbers - User can add, remove Reference Numbers                                                    |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 5: Reference Numbers - User can edit Reference Number instance, save edits, and form clears                      |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 6: Proposal - User add, save text to Proposal                                                                    |:white_check_mark:  |    ?   |    ?    |   ?  |
| Step 7: Contacts - User can add new or existing resource(s) in contact widgets                                        |:white_check_mark:  |    ?   |    ?    |   ?  |
| Final Step - User can jump to resource                                                                                |:white_check_mark:  |    ?   |    ?    |   ?  |
| Final Step - User can start new workflow                                                                              |:white_check_mark:  |    ?   |    ?    |   ?  |
| All Steps - User can navigate backward and forward already-completed steps                                            |:white_check_mark:  |    ?   |    ?    |   ?  |
| All Steps - User can Quit to delete workflow resource                                                                 |:white_check_mark:  |    ?   |    ?    |   ?  |
| All Steps - User can Finish to save workflow resource and exit                                                        |:white_check_mark:  |    ?   |    ?    |   ?  |
                 
* * *


#### Site Visit Workflow

Assigned to: 

| Test Subject                                                             | Chrome | Firefox | UI  | Notes |
| ------------------------------------------------------------------------ | :----: | :----: | :-----: | :--: |
| Step 1: Related Consultation - User can select and save related Consultation                  |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 1: Related Consultation - User can enter, save Date and Description                      |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 2: Site Visit Attendees - User can add new or existing resource for "Attendees"          |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 2: Site Visit Attendees - User can select concept for "Role"                             |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 2: Site Visit Attendees - User can add, remove Attendees                                 |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 2: Site Visit Attendees - User can edit Attendees instance, save edits, and form clears  |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 3: Observations - User can text to Observations                                          |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 4: Recommendations - User can text to Recommendations                                    |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 5: Photos (Upload) - User can upload only 1 photo                                        |  ?  |    ?   |    ?    |   ?  |
| Step 5: Photos (Upload) - User can delete photo                                               |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 6: Photos (Edit) - User can edit name and caption of photo                               |  ?  |    ?   |    ?    |   ?  |
| Final Step - User can jump to resource                                                        |:white_check_mark:|    ?   |    ?    |   ?  |
| Final Step - User can start new workflow                                                      |:white_check_mark:|    ?   |    ?    |   ?  |
| All Steps - User can navigate backward and forward already-completed steps                    |:white_check_mark:|    ?   |    ?    |   ?  |
| All Steps - User can Quit to delete workflow resource                                         |:white_check_mark:|    ?   |    ?    |   ?  |
| All Steps - User can Finish to save workflow resource and exit                                |:white_check_mark:|    ?   |    ?    |   ?  |


* * *


#### Communication Workflow

Assigned to: 

| Test Subject                                                             | Chrome | Firefox | UI  | Notes |
| ------------------------------------------------------------------------ | :----: | :----: | :-----: | :--: |
| Step 1: Related Consultation - User can select and save related Consultation                    |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 1: Related Consultation - User can enter, save Date, Type, Subject                         |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 1: Related Consultation - User can add new or existing resource(s) for Participants        |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 2: Notes - User can add, save text to Notes                                                |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 3: Follow-On Actions - User can add, save text to Follow-On Actions                        |:white_check_mark:|    ?   |    ?    |   ?  |
| Step 4: Upload Documents - User can upload, add more, delete individually, and delete all files |:white_check_mark:|    ?   |    ?    |   ?  | 
| Step 4: Upload Documents - User can filter files by keyword                                     |:white_check_mark:|    ?   |    ?    |   ?  | 
| Step 4: Upload Documents - User can change page-count                                           |:white_check_mark:|    ?   |    ?    |   ?  | 
| Final Step - User can jump to resource                                                          |:white_check_mark:|    ?   |    ?    |   ?  |
| Final Step - User can start new workflow                                                        |:white_check_mark:|    ?   |    ?    |   ?  |
| All Steps - User can navigate backward and forward already-completed steps                      |:white_check_mark:|    ?   |    ?    |   ?  |
| All Steps - User can Quit to delete workflow resource                                           |:white_check_mark:|    ?   |    ?    |   ?  |
| All Steps - User can Finish to save workflow resource and exit                                  |:white_check_mark:|    ?   |    ?    |   ?  |

* * *


#### Correspondence Workflow

Assigned to: 

| Test Subject                                                             | Chrome | Firefox | UI  | Notes |
| ------------------------------------------------------------------------ | :----: | :----: | :-----: | :--: |
| Step 1: Related Consultation - User can select and save related Consultation                    |:white_check_mark: |    ?   |    ?    |   ?  |
| Step 1: Related Consultation - User can select concept for Letter Type                         | :white_check_mark:|    ?   |    ?    |   ?  |
| Final Step - User can download letter                                                          | :white_check_mark:|    ?   |    ?    |   ?  |
| Final Step - User can jump to resource                                                          |:white_check_mark: |    ?   |    ?    |   ?  |
| Final Step - User can start new workflow                                                        |:white_check_mark: |    ?   |    ?    |   ?  |
| All Steps - User can navigate backward and forward already-completed steps                      |:white_check_mark: |    ?   |    ?    |   ?  |
| All Steps - User can Quit to delete workflow resource                                           |:white_check_mark: |    ?   |    ?    |   ?  |
| All Steps - User can Finish to save workflow resource and exit                                  |:white_check_mark: |    ?   |    ?    |   ?  |


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

