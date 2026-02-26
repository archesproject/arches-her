define([
    'knockout',
    'arches',
    'viewmodels/alert-json',
    'templates/views/components/plugins/init-workflow.htm'
], function(ko, arches, JsonErrorAlertViewModel, InitWorkflowTemplate) {

    var InitWorkflow = function(params) {
        this.workflows = ko.observableArray([]);
        this.helpTemplateData = ko.observableArray([]);

        // retaining previous logic while all workflow config is stored in init-workflow
        this.workflows = params.workflows.map(function(wf){
            wf.url = arches.urls.plugin(wf.slug);
            return wf;
        }, this);

        this.shouldShowWorkflowHelp = ko.observable(false);
        this.helpTemplateUrl = ko.observable();
        this.isHelpTemplateLoading = ko.observable();
        this.selectedHelpTemplate = ko.observable();
        this.selectedHelpTemplate.subscribe(helpTemplateName => {
            if (helpTemplateName) {
                this.isHelpTemplateLoading(true);
                this.helpTemplateUrl(arches.urls.help_template + `?template=${helpTemplateName}`);
            }
            else {
                this.helpTemplateUrl(null);
            }
        })

        this.shouldShowIncompleteWorkflowsModal = ko.observable(false);
        this.requestingUserIsSuperuser = ko.observable(false);

        this.incompleteWorkflows = ko.observableArray([]);
        this.incompleteWorkflows.subscribe(incompleteWorkflows => {
            if (incompleteWorkflows.length) {
                this.shouldShowIncompleteWorkflowsModal(true);
            }
        });

        fetch(arches.urls.api_user_incomplete_workflows).then(resp => {
            if (resp.ok) {
                return resp.json();
            }
            else {
                params.alert(new JsonErrorAlertViewModel('ep-alert-red', resp.responseJSON));
            }
        }).then(respJSON => {
            this.incompleteWorkflows(respJSON['incomplete_workflows'].map(workflowData => {
                const datetime = new Date(workflowData['created']);
                workflowData['created'] = datetime.toLocaleString();

                return workflowData;
            }));

            this.requestingUserIsSuperuser(respJSON['requesting_user_is_superuser']);
       });
    };

    return ko.components.register('init-workflow', {
        viewModel: InitWorkflow,
        template: InitWorkflowTemplate
    });
});
