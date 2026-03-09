define([
    'knockout',
    'arches',
    'viewmodels/alert-json',
    'templates/views/components/plugins/init-workflow.htm'
], function(ko, arches, JsonErrorAlertViewModel, InitWorkflowTemplate) {

    var InitWorkflow = function(params) {
        this.workflows = ko.observableArray([]);
        this.helpTemplateData = ko.observableArray([]);

        fetch(arches.urls.api_plugins).then(resp => {
            if (resp.ok) {
                return resp.json();
            }
            else {
                params.alert(new JsonErrorAlertViewModel('ep-alert-red', resp.responseJSON));
            }
        }).then(respJSON => {
            let workflows = respJSON.reduce((acc, plugin) => {
                if (plugin.config.is_workflow) {
                    plugin.url = arches.urls.plugin(plugin.slug);
                    acc.push(plugin);
                }
                return acc;
            }, []);

            let workflowOrder = [
                'b2778828-a6ac-6481-c38b-fd463d878f1f', // application area
                'a1667717-b7bd-4570-b27a-ec352c767e0e', // consultation
                '4dc9bd5a-6e5c-440d-ae3c-af94396e2d72', // communication
                '0b1499e0-6cdc-403b-a2e3-499c2201069d', // site visit
                '4bd762cf-b581-11e9-a7f9-784f435179ea', // correspondence
            ]
            workflows.sort((a, b) => {
                return workflowOrder.indexOf(a.pluginid) - workflowOrder.indexOf(b.pluginid);
            });

            this.workflows(workflows);
            this.helpTemplateData(workflows.reduce((acc, workflow) => {
                if (workflow.helptemplate) {
                    acc.push({'text': workflow.name, 'id': workflow.helptemplate});
                }

                return acc;
            }, []));
        });

        this.shouldShowWorkflowHelp = ko.observable(false);
        this.helpTemplateHtml = ko.observable();
        this.isHelpTemplateLoading = ko.observable();
        this.selectedHelpTemplate = ko.observable();
        this.selectedHelpTemplate.subscribe(helpTemplateName => {
            if (helpTemplateName) {
                this.isHelpTemplateLoading(true);
                fetch(arches.urls.help_template + `?template=${helpTemplateName}`)
                    .then(resp => resp.text())
                    .then(html => {
                        this.helpTemplateHtml(html);
                        this.isHelpTemplateLoading(false);
                    });
            }
            else {
                this.helpTemplateHtml(null);
            }
        })

        this.shouldShowIncompleteWorkflowsModal = ko.observable(false);
        this.requestingUserIsSuperuser = ko.observable(false);

        // Subscribe to modal state to manage focus with delay for screen readers
        this.shouldShowIncompleteWorkflowsModal.subscribe(isOpen => {
            if (isOpen) {
                // Delay focus to allow screen readers to announce dialog context
                setTimeout(() => {
                    const closeButton = document.getElementById('close-workflow-modal-btn');
                    if (closeButton) {
                        closeButton.focus();
                    }
                }, 100);
            }
        });

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

        // Focus trap for incomplete workflows modal
        this.handleModalKeydown = function(data, event) {
            if (event.key === 'Tab' || event.keyCode === 9) {
                const modal = event.currentTarget.querySelector('.workflow-incomplete-modal-container');
                if (!modal) return true;

                const focusableElements = modal.querySelectorAll(
                    'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );
                
                if (focusableElements.length === 0) return true;

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) {
                    // Shift + Tab: if on first element, move to last
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                        return false;
                    }
                } else {
                    // Tab: if on last element, move to first
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        event.preventDefault();
                        return false;
                    }
                }
            }
            
            // Allow Escape key to close modal
            if (event.key === 'Escape' || event.keyCode === 27) {
                this.shouldShowIncompleteWorkflowsModal(false);
                setTimeout(() => {
                    document.getElementById('show-workflow-modal-btn')?.focus();
                }, 0);
                event.preventDefault();
                return false;
            }

            return true;
        };
    };

    return ko.components.register('init-workflow', {
        viewModel: InitWorkflow,
        template: InitWorkflowTemplate
    });
});
