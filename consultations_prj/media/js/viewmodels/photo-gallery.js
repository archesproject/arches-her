define([
    'knockout',
], function(ko) {


    GalleryViewModel = function() {
        this.selectItem = function(val){
            if (val.selected) {
                val.selected(true);
            }
        }

        this.pan = ko.observable()
        this.updatePan = function(val){
            if (this.pan() !== val) {
                this.pan(val);
            } else {
                this.pan.valueHasMutated();
            }
        };
    };

    return GalleryViewModel;
});
