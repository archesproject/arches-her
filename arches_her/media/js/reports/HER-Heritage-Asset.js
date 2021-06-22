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
                    {'id': 'biblio', 'title': 'Bibliography'},
                    {'id': 'photos', 'title': 'Photos'},
                    {'id': 'dates', 'title': 'Scientific Dates'},
                    {'id': 'related', 'title': 'Related Resources'},
                    {'id': 'json', 'title': 'JSON'},
                ];

                //Names Table
                ReportViewModel.apply(this, [params]);
                this.activeSection = ko.observable('name')
                this.nameTableConfig = {
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
