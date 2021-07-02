define([
    'knockout',
    'viewmodels/report',
    'bindings/datatable',
    ], 
    function(ko, ReportViewModel) {
        return ko.components.register('HER-Heritage-Asset', {
            viewModel: function(params) {
                params.configKeys = [];

                //Set-up nav sections
                this.sections = [
                    {'id': 'name', 'title': 'Names/Indentifiers'},
                    {'id': 'description', 'title': 'Descriptions'},
                    {'id': 'location', 'title': 'Locations'},
                    {'id': 'designation', 'title': 'Designation/Protection'},
                    {'id': 'phase', 'title': 'Phases/Components'},
                    {'id': 'prod', 'title': 'Production'},
                    {'id': 'biblio', 'title': 'Bibliography'},
                    {'id': 'photos', 'title': 'Photos'},
                    {'id': 'dates', 'title': 'Scientific Dates'},
                    {'id': 'related', 'title': 'Associated Resources'},
                    {'id': 'json', 'title': 'JSON'}
                ];


                ReportViewModel.apply(this, [params]);
                
                //Set default Nav tab
                this.activeSection = ko.observable('name');

                //toggle display of a div
                this.blockVisiblity = ko.observable(true);
                this.toggleVis =  function(){
                     this.blockVisiblity(!this.blockVisiblity());
                };




                //Names table configuration
                this.nameTableConfig = {
                    "responsive": {
                        breakpoints: [
                          {name: 'bigdesktop', width: Infinity},
                          {name: 'meddesktop', width: 1480},
                          {name: 'smalldesktop', width: 1280},
                          {name: 'medium', width: 1188},
                          {name: 'tabletl', width: 1024},
                          {name: 'btwtabllandp', width: 848},
                          {name: 'tabletp', width: 768},
                          {name: 'mobilel', width: 480},
                          {name: 'mobilep', width: 320}
                        ]
                      },
                    "paging": false,
                    "searching": false,
                    "scrollCollapse": true,
                    "info": false,
                    "columnDefs": [ {
                        "orderable": false,
                        "targets":   -1
                    } ],
                    "columns": [
                        null,
                        null,
                        null,
                        null
                    ]
                };

                //Address table configuration
                this.addressTableConfig = {
                    "responsive": {
                        breakpoints: [
                          {name: 'bigdesktop', width: Infinity},
                          {name: 'meddesktop', width: 1480},
                          {name: 'smalldesktop', width: 1280},
                          {name: 'medium', width: 1188},
                          {name: 'tabletl', width: 1024},
                          {name: 'btwtabllandp', width: 848},
                          {name: 'tabletp', width: 768},
                          {name: 'mobilel', width: 480},
                          {name: 'mobilep', width: 320}
                        ]
                      },
                    "paging": false,
                    "searching": false,
                    "scrollCollapse": true,
                    "info": false,
                    "columnDefs": [ {
                        "orderable": false,
                        "targets":   -1
                    } ],
                    "columns": [
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ]
                };

                //Location descriptions table configuration
                this.locDescriptionsTableConfig = {
                    "responsive": {
                        breakpoints: [
                          {name: 'bigdesktop', width: Infinity},
                          {name: 'meddesktop', width: 1480},
                          {name: 'smalldesktop', width: 1280},
                          {name: 'medium', width: 1188},
                          {name: 'tabletl', width: 1024},
                          {name: 'btwtabllandp', width: 848},
                          {name: 'tabletp', width: 768},
                          {name: 'mobilel', width: 480},
                          {name: 'mobilep', width: 320}
                        ]
                      },
                    "paging": false,
                    "searching": false,
                    "scrollCollapse": true,
                    "info": false,
                    "columnDefs": [ {
                        "orderable": false,
                        "targets":   -1
                    } ],
                    "columns": [
                        null,
                        null,
                        null
                    ]
                };

                //Statements Table
                this.statementsTableConfig = {
                    "responsive": true,
                    "paging": false,
                    "searching": false,
                    "scrollCollapse": true,
                    "info": false,
                    "columnDefs": [ {
                        "orderable": false,
                        "targets":   -1
                    } ],
                    "columns": [
                        null,
                        null,
                        null,
                        null,
                        null
                    ]
                };

                //Construction Phases table configuration
                this.conPhasesTableConfig = {
                    "responsive": {
                        breakpoints: [
                          {name: 'bigdesktop', width: Infinity},
                          {name: 'meddesktop', width: 1480},
                          {name: 'smalldesktop', width: 1280},
                          {name: 'medium', width: 1188},
                          {name: 'tabletl', width: 1024},
                          {name: 'btwtabllandp', width: 848},
                          {name: 'tabletp', width: 768},
                          {name: 'mobilel', width: 480},
                          {name: 'mobilep', width: 320}
                        ]
                      },
                    "paging": false,
                    "searching": false,
                    "scrollCollapse": true,
                    "info": false,
                    "columnDefs": [ {
                        "orderable": false,
                        "targets":   -1
                    } ],
                    "columns": [
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ]
                };

               
                if (params.summary) {
                    // code specific to summary reports here
                } else {
                    // code specific to full reports here
                    nav = ['Names/Indentifiers', 'Descriptions', 'Locations', 'Designation/Protection', 'Phases/Components', 'Bibliography', 'Photos', 'Scientific Dates', 'Associated Resources', 'JSON'];
                }
            },
            template: { require: 'text!templates/views/components/reports/HER-Heritage-Asset.htm' }
        });
    }
);
