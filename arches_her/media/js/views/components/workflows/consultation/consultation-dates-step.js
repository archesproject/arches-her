define([
    'jquery',
    'arches',
    'knockout',
    'knockout-mapping',
    'templates/views/components/workflows/consultation/consultation-dates-step.htm',
], function($, arches, ko, koMapping, consultationDatesStepTemplate) {
    function viewModel(params) {

        var self = this;
        $.extend(this, params.form);
        self.resourceid = params.resourceid;

        this.relatedAppAreaTile = ko.observable();
        this.displayName = ko.observable();
        this.concatName = ko.observable('Consultation for [Application Area] on [Log Date]');
        this.consultationNameNodegroupId = '4ad66f55-951f-11ea-b2e2-f875a44e0e11';
        this.consultationNameNodeId = '4ad69684-951f-11ea-b5c3-f875a44e0e11';
        this.consultationAppAreaNodegroupId = '152aa058-936d-11ea-b517-f875a44e0e11';
        this.appAreaNodeId = "ba54228c-2f4e-11eb-abb5-acde48001122";
        this.consultationLocationNodegroupId = '152aa058-936d-11ea-b517-f875a44e0e11';
        this.logDateNodeId = "40eff4cd-893a-11ea-b0cc-f875a44e0e11";
        this.targetDateNodeId = "7224417b-893a-11ea-b383-f875a44e0e11";
        this.tile().transactionId = this.workflowId;

        this.getResourceDisplayName = function(resourceids) {
            var retStr = '';
            resourceids.forEach(function(id) {
                $.get(
                    arches.urls.resource_descriptors + id,
                    function(descriptors) {
                        retStr == '' ? retStr = descriptors.displayname : retStr += (', '+descriptors.displayname);
                        self.displayName(retStr);
                    }
                );
            });
        };

        this.saveConsultationNameTile = function() {
            let nameCardTile;
            const nameCard = self.topCards.find(function(topCard) {
                return topCard.nodegroupid == self.consultationNameNodegroupId;
            });
            if (!nameCard.tiles().length) {
                nameCardTile = nameCard.getNewTile();
            } else {
                nameCardTile = nameCard.tiles()[0];
            }
            nameCardTile.data[self.consultationNameNodeId](self.concatName());
            nameCardTile.transactionId = self.workflowId;
            return nameCardTile.save();
        };

        this.formatDate = function(date) {
            var formatted = date.getFullYear()+'-'+ ('0' + (date.getMonth()+1)).slice(-2)+'-'+('0' + date.getDate()).slice(-2);
            return formatted;
        };

        this.addDays = function(date, days) {
            var copy = new Date(Number(date));
            copy.setDate(date.getDate() + days);
            return self.formatDate(copy);
        };

        self.init = function() {
            var resourceids = [];
            var appAreas;
            var relatedAppAreaTile = self.getTiles(self.consultationAppAreaNodegroupId)[0];
            if(!ko.unwrap(self.displayName) && !ko.unwrap(self.tile().data[self.targetDateNodeId])) {
                appAreas = relatedAppAreaTile && relatedAppAreaTile.data[self.appAreaNodeId]();
                if (appAreas) {
                    resourceids = appAreas.map(function(obj){return obj.resourceId();});
                }
                self.getResourceDisplayName(resourceids);
                self.loading(false);
                self.saving(false);
            }
        };

        self.tile().data[self.logDateNodeId].subscribe(function(val) {
            var logDateVal;
            var targetDateVal;
            var DefaultTargetDateLeadTime = 21;
            if(val) {
                logDateVal = new Date(`${val} 00:00`);
                if (logDateVal != 'Invalid Date') {
                    self.concatName(`Consultation for ${self.displayName()} on ${self.formatDate(logDateVal)}`);
                    targetDateVal = self.addDays(logDateVal, DefaultTargetDateLeadTime);
                    self.tile().data[self.targetDateNodeId](targetDateVal);
                }
            }
        });

        params.form.save = function() {
            self.tile().save()
                .then(
                    function(data){
                        self.tile().tileid = data.tileid;
                        return self.saveConsultationNameTile();
                    })
                .then(function(){
                    params.form.savedData({
                        tileData: koMapping.toJSON(self.tile().data),
                        tileId: self.tile().tileid,
                        resourceInstanceId: self.tile().resourceinstance_id,
                        nodegroupId: self.tile().nodegroup_id
                    });
                    params.form.complete(true);
                    params.form.saving(false);
                });
        };

        self.tile().dirty.subscribe(function(dirty) {
            params.dirty(dirty);
        });

        self.init();
    }

    return ko.components.register('consultation-dates-step', {
        viewModel: viewModel,
        template: consultationDatesStepTemplate
    });
});
