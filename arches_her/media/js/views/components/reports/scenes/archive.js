define([
    'underscore',
    'knockout',
    'arches',
    'utils/report',
    'templates/views/components/reports/scenes/archive.htm',
    'bindings/datatable'
], function(_, ko, arches, reportUtils, archiveReportTemplate) {
    return ko.components.register('views/components/reports/scenes/archive', {
        viewModel: function(params) {
            const self = this;
            Object.assign(self, reportUtils);

            // repository storage table configuration
            self.repositoryStorageConfig = {
                ...self.defaultTableConfig,
                columns: Array(4).fill(null)
            }

            // repository storage table configuration
            self.sourceCreationConfig = {
                ...self.defaultTableConfig,
                columns: Array(5).fill(null)
            }

            self.dataConfig = {}

            self.cards = Object.assign({}, params.cards);
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.repositoryStorage = ko.observableArray();
            self.sourceCreation = ko.observableArray();
            self.visible = {
                repositoryStorage: ko.observable(true),
                sourceCreation: ko.observable(true)
            }
            Object.assign(self.dataConfig, params.dataConfig || {});

            // if params.compiled is set and true, the user has compiled their own data.  Use as is.
            if(params?.compiled){
            } else {
                const repositoryStorageNode = self.getRawNodeValue(params.data(), self.dataConfig.repositoryStorage) 
                if(repositoryStorageNode){
                    const repositoryOwner = self.getNodeValue(repositoryStorageNode, 'repository owner');
                    const repositoryOwnerLink = self.getResourceLink(self.getRawNodeValue(repositoryStorageNode, 'repository owner'));
                    const storageAreaName = self.getNodeValue(repositoryStorageNode, 'storage area names', 'storage area name');
                    const storageBuilding = self.getNodeValue(repositoryStorageNode, 'storage building', 'storage building name');
                    const tileid = self.getTileId(repositoryStorageNode);
                    this.repositoryStorage([{
                        repositoryOwner,
                        repositoryOwnerLink,
                        storageAreaName,
                        storageBuilding,
                        tileid
                    }]);
                }
                
                const sourceCreationNode = self.getRawNodeValue(params.data(), self.dataConfig.sourceCreation) 
                if(Array.isArray(sourceCreationNode)) {
                    this.sourceCreation(sourceCreationNode.map(x => {
                        const author = self.getNodeValue(x, 'authorship', 'author', 'author names', 'author name');
                        const editor = self.getNodeValue(x, 'editorship', 'editor', 'editor names', 'editor name');
                        const contributor = self.getNodeValue(x, 'contribution', 'contributors', 'contributor names', 'contributor name');
                        const statement = self.getNodeValue(x, 'creation statement of responsibility', 'statement of responsibility');
                        const tileid = self.getTileId(x);
                        return {
                            author,
                            editor,
                            contributor,
                            statement,
                            tileid
                        };
                    }));
                }              
            } 
        },
        template: archiveReportTemplate
    });
});