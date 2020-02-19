define([
    'jquery',
    'underscore',
    'knockout',
    'backbone',
    'views/page-view',
    'view-data',
    'bindings/datatable',
    'uuid',
    'core-js',
    'dom-4'
], function($, _, ko, Backbone, PageView, data) {

    var BaseManager = PageView.extend({
        /**
        * Creates an instance of PageView, optionally using a passed in view model
        * appends the following properties to viewModel:
        * allGraphs - an array of graphs models as JSON (not model instances)
        *
        * @memberof PageView.prototype
        * @param {object} options
        * @param {object} options.viewModel - an optional view model to be
        *                 bound to the page
        * @return {object} an instance of BaseManager
        */
        constructor: function(options) {
            options = options ? options : {};
            options.viewModel = (options && options.viewModel) ? options.viewModel : {};
            options.viewModel.navbarClosed = ko.observable(false);
            var workflows = ['application-area', 'consultation-workflow', 'communication-workflow', 'site-visit', 'correspondence-workflow'];

            if (localStorage.getItem('navbarClosedLocal') !== undefined) {
                options.viewModel.navbarClosed(JSON.parse(localStorage.getItem('navbarClosedLocal')));
                // console.log("ko set to: "+options.viewModel.navbarClosed());
            } else {
                localStorage.setItem('navbarClosedLocal', false);
                options.viewModel.navbarClosed(false);
                // console.log("ko set to: "+options.viewModel.navbarClosed());
            }

            options.viewModel.navbarToggle = function(val) {
                localStorage.setItem('navbarClosedLocal', val);
                options.viewModel.navbarClosed(val);
            };

            data.graphs.sort(function(left, right) {
                return left.name.toLowerCase() == right.name.toLowerCase() ? 0 : (left.name.toLowerCase() < right.name.toLowerCase() ? -1 : 1);
            });
            data.graphs.forEach(function(graph){
                graph.name = ko.observable(graph.name);
                graph.iconclass = ko.observable(graph.iconclass);
            });
            options.viewModel.allGraphs = ko.observableArray(data.graphs);
            options.viewModel.graphs = ko.computed(function() {
                return ko.utils.arrayFilter(options.viewModel.allGraphs(), function(graph) {
                    return !graph.isresource;
                });
            });
            options.viewModel.resources = ko.computed(function() {
                return  ko.utils.arrayFilter(options.viewModel.allGraphs(), function(graph) {
                    return graph.isresource;
                });
            });
            options.viewModel.createableResources = ko.observableArray(data.createableResources) || null;

            options.viewModel.setResourceOptionDisable = function(option, item) {
                if (item) {
                    ko.applyBindingsToNode(option, {disable: item.disable_instance_creation}, item);
                }
            };

            options.viewModel.navExpanded = ko.observable(false);
            options.viewModel.navExpanded.subscribe(function() {
                window.nifty.window.trigger('resize');
            });

            options.viewModel.inSearch = ko.pureComputed(function() {
                return window.location.pathname === "/arches-her/search";
            });
            options.viewModel.inActiveCons = ko.pureComputed(function() {
                return window.location.pathname === "/arches-her/plugins/active-consultations";
            });
            options.viewModel.inInitWorkflow = ko.pureComputed(function() {
                return window.location.pathname === "/arches-her/plugins/init-workflow";
            });
            options.viewModel.inDashboard = ko.pureComputed(function() {
                return window.location.pathname === "/arches-her/plugins/dashboard";
            });
            options.viewModel.inHelp = ko.pureComputed(function() {
                return window.location.pathname === "/arches-her/consultations-help";
            });
            options.viewModel.inAbout = ko.pureComputed(function() {
                return window.location.pathname === "/arches-her/consultations-about";
            });

            PageView.prototype.constructor.call(this, options);
            return this;
        }

    });
    return BaseManager;


});
