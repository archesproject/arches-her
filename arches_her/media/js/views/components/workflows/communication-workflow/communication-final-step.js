define([
    'knockout',
    'views/components/workflows/summary-step',
    'viewmodels/alert'
], function(ko, SummaryStep, AlertViewModel) {

    function viewModel(params) {
        var self = this;
        params.form.resourceId = params.form.externalStepData.relatedconsultationstep.data.resourceid;
        SummaryStep.apply(this, [params]);
        this.documents = ko.observableArray();
        this.resourceLoading = ko.observable(true);
        this.relatedResourceLoading = ko.observable(true);
        this.digitalObjectResourceId = ko.observable();

        if (params.form.externalStepData.uploaddocumentstep.data) {
            this.digitalObjectResourceId(params.form.externalStepData.uploaddocumentstep.data.resourceid);
            this.digitalObjectResourceName = params.form.externalStepData.uploaddocumentstep.data.digitalObjectResourceInstanceName;
        };

        var currentTileId = ko.unwrap(params.form.externalStepData.relatedconsultationstep.data.tileid)

        this.resourceData.subscribe(function(val){
            var currentCommunication;
            if (Array.isArray(val.resource.Communications)){
                val.resource.Communications.forEach(function(comm) {
                    if (comm['@tile_id'] === currentTileId){
                        currentCommunication = comm;
                    }
                });
            } else {
                currentCommunication = val.resource.Communications;
            }

            this.displayName = val['displayname'] || 'Unnamed';
            this.reportVals = {
                consultationName: {'name': 'Consultation', 'value': this.getResourceValue(val, ['displayname'])},
                subject: {'name': 'Subject', 'value': this.getResourceValue(currentCommunication, ['Subjects', 'Subject', '@value'])},
                type: {'name': 'Type', 'value': this.getResourceValue(currentCommunication, ['Communication Type', '@value'])},
                date: {'name': 'Date', 'value': this.getResourceValue(currentCommunication, ['Dates', 'Date', '@value'])},
                participants: {'name': 'Participants', 'value': this.getResourceValue(currentCommunication, ['Attendees', '@value'])},
                relatedCondition: {'name': 'Related Condition', 'value': this.getResourceValue(currentCommunication, ['Related Condition', '@value'])},
                notes: {'name': 'Notes', 'value': this.getResourceValue(currentCommunication, ['Communication Notes', 'Communication Description', '@value'])},
                followOnActions: {'name': 'Follow-on Actions', 'value': this.getResourceValue(currentCommunication, ['Follow on Actions', 'Follow-On Actions', '@value'])},
                uploadedFiles: {'name': 'Uploaded Files', 'value': this.getResourceValue(currentCommunication, ['Digital File(s)', '@value'])},
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
            var currentFileList = [];
            fileNodeId = '96f8830a-8490-11ea-9aba-f875a44e0e11';
            digitalObjectGraphId = 'a535a235-8481-11ea-a6b9-f875a44e0e11';
            val["resource_relationships"].forEach(function(relationship){
                if (relationship.tileid === currentTileId){
                    currentFileList.push(relationship.resourceinstanceidto)
                }
            });

            val["related_resources"].forEach(function(rr){
                if (rr.graph_id = digitalObjectGraphId && currentFileList.indexOf(rr.resourceinstanceid) > -1) {
                    rr.tiles.forEach(function(tile){
                        if (tile.data[fileNodeId]){
                            tile.data[fileNodeId].forEach(function(file){
                                self.documents.push({
                                    'name': file.name,
                                    'size': file.size,
                                    'url': file.url,
                                });
                            });
                        }
                    });
                }
            });
            this.relatedResourceLoading(false);
            if (!this.resourceLoading()){
                this.loading(false);
            }
        }, this);
    }

    ko.components.register('communication-final-step', {
        viewModel: viewModel,
        template: { require: 'text!templates/views/components/workflows/communication-workflow/communication-final-step.htm' }
    });
    return viewModel;
});
