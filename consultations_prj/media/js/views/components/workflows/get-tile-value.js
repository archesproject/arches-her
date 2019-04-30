define([
    'underscore',
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'views/components/workflows/new-tile-step'
], function(_, $, arches, ko, koMapping, NewTileStep) {
    function viewModel(params) {
        var self = this;
        params.output = ko.observable();
        params.applyOutputToTarget = ko.observable(true);
        NewTileStep.apply(this, [params]);
        this.output = params.output;
        this.applyOutputToTarget = params.applyOutputToTarget;
        payload = ko.pureComputed(function(){
            var output = {
                applyOutputToTarget: self.applyOutputToTarget,
                targetnode: '1b95fb70-53ef-11e9-9001-dca90488358a',
                targetnodegroup: 'c5f909b5-53c7-11e9-a3ac-dca90488358a',
                resourceid: params.resourceid,
                value: ''
            }
            if (ko.unwrap(self.tile)) {
                _.each(koMapping.toJS(self.tile().data), function(v, k) {
                    if(v) {
                        output.value += ' ' + v
                    }
                });
            }
            return output
        });

        payload.subscribe(function(val) {
            if (val) {
                self.output(val);
            }
        });
    };


    return ko.components.register('get-tile-value', {
        viewModel: viewModel,
        template: {
            require: 'text!templates/views/components/workflows/get-tile-value.htm'
        }
    });
    return viewModel;
});
