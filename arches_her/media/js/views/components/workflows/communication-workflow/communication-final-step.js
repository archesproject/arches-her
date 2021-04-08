define([
    'knockout',
    'views/components/workflows/summary-step',
    'viewmodels/alert'
], function(ko, SummaryStep, AlertViewModel) {

    function viewModel(params) {
        var self = this;
        SummaryStep.apply(this, [params]);
        this.documents = ko.observableArray();
        this.resourceLoading = ko.observable(true);
        this.relatedResourceLoading = ko.observable(true);

        this.resourceData.subscribe(function(val){
            var currentCommunication;
            if (Array.isArray(val.resource.Communications)){
                val.resource.Communications.forEach(function(comm) {
                    if (comm['@tile_id'] === JSON.parse(localStorage["workflow-steps"])[JSON.parse(localStorage.workflow)["workflow-step-ids"][0]].value.tileid){
                        currentCommunication = comm;
                    }
                });
            } else {
                currentCommunication = val.resource.Communications;
            }
            this.reportVals = {
                consultationName: {'name': 'Consultation', 'value': val.resource['Consultation Names']['Consultation Name']['@value'] || 'none'},
                subject: {'name': 'Subject', 'value': currentCommunication['Subjects']['Subject']['@value'] || 'none'},
                type: {'name': 'Type', 'value': currentCommunication['Communication Type']['@value'] || 'none'},
                date: {'name': 'Date', 'value': currentCommunication['Dates']['Date']['@value'] || 'none'},
                participants: {'name': 'Participants', 'value': currentCommunication['Attendees']['@value'] || 'none'},
                relatedCondition: {'name': 'Related Condition', 'value': currentCommunication['Related Condition']['@value'] || 'none'},
                notes: {'name': 'Notes', 'value': currentCommunication['Communication Notes']['Communication Description']['@value'] || 'none'},
                followOnActions: {'name': 'Follow-on Actions', 'value': currentCommunication['Follow on Actions']['Follow-On Actions']['@value'] || 'none'},
                uploadedFiles: {'name': 'Uploaded Files', 'value': currentCommunication['Digital File(s)']['@value'] || 'none'},
            }
            this.resourceLoading(false);
            if (!this.relatedResourceLoading()){
                this.loading(false);
            };
        }, this);

        this.formatSize = function(file) {
            var bytes = ko.unwrap(file.size);
            if(bytes == 0) return '0 Byte';
            var k = 1024;
            var dm = 2;
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            var i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
        };

        this.relatedResources.subscribe(function(val){
            fileNodeId = '96f8830a-8490-11ea-9aba-f875a44e0e11';
            digitalObjectGraphId = 'a535a235-8481-11ea-a6b9-f875a44e0e11';
            if (Array.isArray(val)){
                val.forEach(function(resource){
                    if (resource.graph_id = digitalObjectGraphId) {
                        resource.tiles.forEach(function(tile){
                            if (tile.data[fileNodeId]){
                                tile.data[fileNodeId].forEach(function(file){
                                    self.documents.push({
                                        'name': file.name,
                                        'size': file.size,
                                    })
                                })
                            }
                        })
                    }
                });
            }
            this.relatedResourceLoading(false);
            if (!this.resourceLoading()){
                this.loading(false);
            };
        }, this);
    }

    ko.components.register('communication-final-step', {
        viewModel: viewModel,
        template: { require: 'text!templates/views/components/workflows/communication-workflow/communication-final-step.htm' }
    });
    return viewModel;
});
