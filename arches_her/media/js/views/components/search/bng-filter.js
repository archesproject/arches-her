define([
    'jquery',
    'underscore',
    'arches',
    'knockout',
    'views/components/search/base-filter',
    'views/components/map',
    'views/components/widgets/map/bin-feature-collection',
    'views/components/widgets/map/map-styles',
    'turf',
    'geohash',
    'geojson-extent',
    'uuid',
    'geojsonhint',
], function($, _, arches, ko, BaseFilter, MapComponentViewModel, binFeatureCollection, mapStyles, turf, geohash,  geojsonExtent, uuid, geojsonhint) {
    var componentName = 'bng-filter';
    return ko.components.register(componentName, {
        viewModel: BaseFilter.extend({
            initialize: function(options) {
                var self = this;

                this.dependenciesLoaded = ko.observable(false)
                this.bng = ko.observable('').extend({ rateLimit: 200 });
                
                options.name = "BNG Filter";
                BaseFilter.prototype.initialize.call(this, options);

                this.filter = {
                    bng: ko.observable(null),
                    inverted: ko.observable(false)
                };
                
                this.bng.subscribe(function(value) {
                    self.filter.bng(value);
                    self.updateQuery();
                });

                this.filters[componentName](this);
                
            },

            updateQuery: function() {
                var self = this;
                if (this.filter.bng() != "" && this.filter.bng() != null) {
                    var queryObj = this.query();
                    if (this.getFilter('term-filter').hasTag(this.type) === false) {
                        this.getFilter('term-filter').addTag('BNG Filter Enabled', this.name, this.filter.inverted);
                    }
                    queryObj[componentName] = ko.toJSON(this.filter);
                } else {
                    delete queryObj[componentName];
                }
                this.query(queryObj);
            },

            restoreState: function() {
                var query = this.query();
                if (componentName in query) {
                    var bngVal = JSON.parse(query[componentName]);
                    this.filter.inverted(!!bngVal.inverted);
                    this.getFilter('term-filter').addTag(this.name, this.name, this.filter.inverted);
                    this.filter.bng(bngVal.bng);
                }
            },

            clear: function(reset_features) {
                this.filter.bng = "";
                this.getFilter('term-filter').removeTag('BNG Filter Enabled');
            },

            
        }),
        template: { require: 'text!templates/views/components/search/bng-filter.htm' }
    });
});
