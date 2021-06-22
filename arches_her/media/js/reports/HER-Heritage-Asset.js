define([
    'knockout',
    'viewmodels/report',
    'bindings/datatable',
    ], 
    function(ko, ReportViewModel) {
        return ko.components.register('HER-Heritage-Asset', {
            viewModel: function(params) {
                params.configKeys = [];

                ReportViewModel.apply(this, [params]);
                this.activeSection = ko.observable('name')
                this.nameTableConfig = {
                    "responsive": true,
                    "paging": false,
                    "scrollCollapse": true,
                    "info": false,
                    "columns": [
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
