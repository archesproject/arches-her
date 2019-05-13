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
        params.applyOutputToTarget = ko.observable(true);
        NewTileStep.apply(this, [params]);
        this.applyOutputToTarget = params.applyOutputToTarget;

        self.tile.subscribe(function(a){console.log(a)});
        params.getForwardUrlParams = ko.pureComputed(function(){
            var value = '';
            if (ko.unwrap(self.tile)) {
                _.each(koMapping.toJS(self.tile().data), function(v, k) {
                    if(v) {
                        value += ' ' + v
                    }
                });
            }
            forwardParams = {
                applyOutputToTarget: params.applyOutputToTarget,
                graphid: params.graphid,
                icon: params.icon,
                iconClass: params.iconClass,
                loading: params.loading,
                nodegroupid: params.nodegroupid,
                parenttileid: params.parenttileid,
                resourceid: params.resourceid,
                targetnode: '1b95fb70-53ef-11e9-9001-dca90488358a',
                targetnodegroup: 'c5f909b5-53c7-11e9-a3ac-dca90488358a',
                value: value
            }
            return koMapping.toJS(forwardParams);
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
