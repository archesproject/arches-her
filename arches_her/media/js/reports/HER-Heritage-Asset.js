define(['knockout',  'viewmodels/report'], 
    function(ko, ReportViewModel) {
        return ko.components.register('HER-Heritage-Asset', {
            viewModel: function(params) {
                params.configKeys = [];

                ReportViewModel.apply(this, [params]);

                if (params.summary) {
                    // code specific to summary reports here
                } else {
                    // code specific to full reports here
                }
            },
            template: { require: 'text!templates/views/components/reports/HER-Heritage-Asset.htm' }
        });
    }
);
