define([
    'underscore',
    'knockout',
    'arches',
    'utils/report',
    'templates/views/components/reports/scenes/classifications.htm',
    'bindings/datatable'
], function(_, ko, arches, reportUtils, classificationsReportTemplate) {
    return ko.components.register('views/components/reports/scenes/classifications', {
        viewModel: function(params) {
            const self = this;
            Object.assign(self, reportUtils);

            // Construction Phases table configuration
            self.conPhasesTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(16).fill(null)
            };

            // Aircraft construction phases table configuration
            self.aircraftConstructionConfig = {
                ...self.defaultTableConfig,
                columns: Array(19).fill(null)
            };

            // Aircraft construction phases table configuration
            self.maritimeProductionConfig = {
                ...self.defaultTableConfig,
                columns: Array(21).fill(null)
            };

            self.artefactProdTableConfiguration= {
                ...self.defaultTableConfig,
                columns: Array(13).fill(null)
            };
            // Components Table
            self.componentsTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(6).fill(null)
            };

            // Dimension Table
            self.dimensionTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(5).fill(null)
            };

            // Dates Table
            self.datesTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(3).fill(null)
            };
            
            // Organization Formation Table
            self.organizationFormationTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(5).fill(null)
            };

            // Use phases Table
            self.usePhasesTableConfig = {
                ...self.defaultTableConfig,
                columns: Array(10).fill(null)
            };

            self.dataConfig = {
                production: undefined,
                artefactProduction: undefined,
                aircraftProduction: undefined,
                maritimeProduction: undefined,
                type: undefined,
                activityTimespan: undefined,
                production: undefined,
                components: undefined,
                usePhase: undefined,
                dimensions: undefined,
                inscriptions: undefined,
                dates: undefined,
                hlcPhase: undefined,
                organizationCurrency: undefined,
                organizationFormation: undefined
            }

            self.cards = Object.assign({}, params.cards);
            self.edit = params.editTile || self.editTile;
            self.delete = params.deleteTile || self.deleteTile;
            self.add = params.addTile || self.addNewTile;
            self.components = ko.observableArray();
            self.production = ko.observableArray();
            self.dimensions = ko.observableArray();
            self.usePhases = ko.observableArray();
            self.typeData = ko.observable();
            self.organizationFormation = ko.observableArray();
            self.dates = ko.observableArray();
            self.activityTimespan = ko.observable();
            self.visible = {
                production: ko.observable(true),
                components: ko.observable(true),
                usePhase: ko.observable(true),
                dimensions: ko.observable(true),
                dates: ko.observable(true),
                organizationFormation: ko.observable(true)
            }
            Object.assign(self.dataConfig, params.dataConfig || {});

            // if params.compiled is set and true, the user has compiled their own data.  Use as is.
            if(params?.compiled){
            } else {
                if(self.dataConfig.type){
                    const typeValue = self.getRawNodeValue(params.data(), self.dataConfig.type);
                    self.typeData = ko.observable({
                        sections:
                            [
                                {
                                    title: 'Type',
                                    card: self.cards?.type,
                                    data: [{
                                        key: 'Type',
                                        value: Array.isArray(typeValue) ? typeValue : [typeValue],
                                        type: 'kv',
                                    }]
                                }
                            ]
                    });
                }

                if(self.dataConfig.activityTimespan){
                    self.activityTimespan = ko.observable({
                        sections:
                            [
                                {
                                    title: 'Activity Timespan',
                                    card: self.cards?.activityTimespan,
                                    data: [{
                                        key: 'Display Date',
                                        value: self.getNodeValue(params.data(), self.dataConfig.activityTimespan, 'Display Date'),
                                        type: 'kv'
                                    },{
                                        key: 'Activity Start Date',
                                        value: self.getNodeValue(params.data(), self.dataConfig.activityTimespan, 'Activity Start Date'),
                                        type: 'kv'
                                    },{
                                        key: 'Activity End Date',
                                        value: self.getNodeValue(params.data(), self.dataConfig.activityTimespan, 'Activity End Date'),
                                        type: 'kv'
                                    },{
                                        key: 'Activity Date Qualifier',
                                        value: self.getNodeValue(params.data(), self.dataConfig.activityTimespan, 'Activity Date Qualifier'),
                                        type: 'kv'
                                    }]
                                }
                            ]
                    });
                }

                const artefactProductionNode = self.getRawNodeValue(params.data(), self.dataConfig.artefactProduction);
                if(Array.isArray(artefactProductionNode)){
                    self.production(artefactProductionNode.map(node => {
                        const material = self.getNodeValue(node, 'material');
                        const productionTechnique = self.getNodeValue(node, 'production technique');
                        const dateQualifier = self.getNodeValue(node, 'production time span', 'production time span date qualifier');
                        const endDate = self.getNodeValue(node, 'production time span', 'to date');
                        const interpretationConfidence = self.getNodeValue(node, 'phase classification', 'phase certainty');
                        const method = self.getNodeValue(node, 'production method');
                        const period = self.getNodeValue(node, 'cultural period');
                        const periodLink = self.getResourceLink(self.getRawNodeValue(node, 'cultural period'));
                        const producer = self.getNodeValue(node, 'producer');
                        const producerLink = self.getResourceLink(self.getRawNodeValue(node, 'producer'));
                        const artefactType = self.getNodeValue(node, 'phase classification', 'artefact type');
                        const phaseCertainty = self.getNodeValue(node, 'phase classification', 'phase certainty');
                        const phaseDescription = self.getNodeValue(node, 'phase classification', 'phase classification description', 'phase description');
                        const phaseEvidence = self.getNodeValue(node, 'phase classification', 'phase evidence type');
                        const startDate = self.getNodeValue(node, 'production time span', 'from date');
                        const tileid = self.getTileId(node);

                        return { 
                            artefactType,
                            dateQualifier, 
                            endDate, 
                            interpretationConfidence,
                            material,
                            method,
                            producer,
                            producerLink,
                            period,
                            periodLink,
                            phaseCertainty,
                            phaseDescription, 
                            phaseEvidence,
                            productionTechnique,
                            startDate, 
                            tileid
                        };
                    }))
                }

                const constructionPhasesNode = self.getRawNodeValue(params.data(), self.dataConfig.production); 
                if(Array.isArray(constructionPhasesNode)) {
                    self.production(constructionPhasesNode.map(x => {
                        const constructionMaterial = self.getNodeValue(x, {testPaths: [['main construction material'], ['material']]});
                        const constructionTechnique = self.getNodeValue(x, {testPaths: [['construction technique'], ['production technique']]});
                        const coveringMaterial = self.getNodeValue(x, 'covering material');
                        const dateConfidence = self.getNodeValue(x, 'construction phase timespan', 'confidence of dating');
                        const dateQualifier = self.getNodeValue(x, 'construction phase timespan', 'construction phase date qualifier');
                        const displayDate = self.getNodeValue(x, 'construction phase timespan', 'construction phase display date');
                        const endDate = self.getNodeValue(x, 'construction phase timespan', 'construction phase end date');
                        const interpretationConfidence = self.getNodeValue(x, 'phase classification', 'phase certainty');
                        const method = self.getNodeValue(x, 'construction method');
                        const period = self.getNodeValue(x, 'cultural period');
                        const periodLink = self.getResourceLink(self.getRawNodeValue(x, 'cultural period'));
                        const phase = self.getNodeValue(x, 'construction phase type');
                        const phaseDescription = self.getNodeValue(x, 'phase classification', 'phase classification description', 'phase description');
                        const phaseEvidence = self.getNodeValue(x, 'phase classification', 'construction phase evidence type');
                        const startDate = self.getNodeValue(x, 'construction phase timespan', 'construction phase start date');
                        const tileid = self.getTileId(x);
                        const assetType = self.getNodeValue(x, 'phase classification', 'asset type');

                        return { 
                            assetType,
                            constructionMaterial, 
                            constructionTechnique, 
                            coveringMaterial, 
                            dateConfidence, 
                            dateQualifier, 
                            displayDate, 
                            endDate, 
                            interpretationConfidence,
                            method, 
                            period,
                            periodLink,
                            phase, 
                            phaseDescription, 
                            phaseEvidence, 
                            startDate, 
                            tileid
                        };
                    }));
                }

                const aircraftProductionNode = self.getRawNodeValue(params.data(), self.dataConfig.aircraftProduction); 
                if(Array.isArray(aircraftProductionNode)) {
                    self.production(aircraftProductionNode.map(x => {
                        const aircraftForm = self.getNodeValue(x, 'phase classification', 'aircraft form');
                        const aircraftFunction = self.getNodeValue(x, 'phase classification', 'aircraft function');
                        const aircraftType = self.getNodeValue(x, 'phase classification', 'aircraft type');
                        const constructionMaterial = self.getNodeValue(x, 'main construction material');
                        const constructionMethod = self.getNodeValue(x, 'construction method');
                        const constructionTechnique = self.getNodeValue(x, 'construction technique');
                        const dateQualifier = self.getNodeValue(x, 'construction phase timespan', 'date qualifier');
                        const displayDate = self.getNodeValue(x, 'construction phase timespan', 'display date');
                        const endDate = self.getNodeValue(x, 'construction phase timespan', 'end date');
                        const interpretationConfidence = self.getNodeValue(x, 'phase classification', 'phase certainty');
                        const method = self.getNodeValue(x, 'construction method');
                        const period = self.getNodeValue(x, 'period');
                        const phase = self.getNodeValue(x, 'construction phase type');
                        const phaseDescription = self.getNodeValue(x, 'phase classification', 'phase classification description', 'phase description');
                        const phaseCertainty = self.getNodeValue(x, 'phase classification', 'phase certainty');
                        const phaseEvidence = self.getNodeValue(x, 'phase classification', 'phase evidence type');
                        const placeOfManufacture = self.getNodeValue(x, 'factory', 'place of manufacture');
                        const startDate = self.getNodeValue(x, 'construction phase timespan', 'start date');
                        const tileid = self.getTileId(x);

                        return { 
                            aircraftForm,
                            aircraftFunction,
                            aircraftType,
                            constructionMaterial,
                            constructionMethod,
                            constructionTechnique, 
                            dateQualifier, 
                            displayDate, 
                            endDate, 
                            interpretationConfidence,
                            method, 
                            period, 
                            phase, 
                            phaseDescription, 
                            phaseCertainty,
                            phaseEvidence,
                            placeOfManufacture,
                            startDate, 
                            tileid
                        };
                    }));
                }

                const maritimeProductionNode = self.getRawNodeValue(params.data(), self.dataConfig.maritimeProduction); 
                if(Array.isArray(maritimeProductionNode)) {
                    self.production(maritimeProductionNode.map(x => {
                        const coveringMaterial = self.getNodeValue(x, 'covering material');
                        const constructionMaterial = self.getNodeValue(x, 'main construction material');
                        const constructionMethod = self.getNodeValue(x, 'construction method');
                        const constructionTechnique = self.getNodeValue(x, 'construction technique');
                        const dateQualifier = self.getNodeValue(x, 'construction phase timespan', 'construction phase date qualifier');
                        const displayDate = self.getNodeValue(x, 'construction phase timespan', 'construction phase display date');
                        const endDate = self.getNodeValue(x, 'construction phase timespan', 'end date');
                        const interpretationConfidence = self.getNodeValue(x, 'phase classification', 'phase certainty');
                        const method = self.getNodeValue(x, 'construction method');
                        const period = self.getNodeValue(x, 'cultural period');
                        const phase = self.getNodeValue(x, 'construction phase type');
                        const phaseDescription = self.getNodeValue(x, 'phase classification', 'phase classification description', 'phase description');
                        const phaseCertainty = self.getNodeValue(x, 'phase classification', 'phase certainty');
                        const phaseEvidence = self.getNodeValue(x, 'phase classification', 'construction phase evidence type');
                        const builder = self.getNodeValue(x, 'builder');
                        const startDate = self.getNodeValue(x, 'construction phase timespan', 'start date');
                        const riggingType = self.getNodeValue(x, 'phase classification', 'type of rigging');
                        const propulsionType = self.getNodeValue(x, 'phase classification', 'propulsion type');
                        const ordnanceType = self.getNodeValue(x, 'phase classification', 'ordnance type');
                        const vesselType = self.getNodeValue(x, 'phase classification', 'maritime vessel type');
                        const fixtureType = self.getNodeValue(x, 'phase classification', 'fixtures and fittings type');
                        const tileid = self.getTileId(x);

                        return { 
                            builder,
                            constructionMaterial,
                            constructionMethod,
                            constructionTechnique, 
                            coveringMaterial,
                            dateQualifier, 
                            displayDate, 
                            endDate, 
                            fixtureType,
                            interpretationConfidence,
                            method, 
                            ordnanceType,
                            period, 
                            phase, 
                            phaseDescription, 
                            phaseCertainty,
                            phaseEvidence,
                            propulsionType,
                            riggingType,
                            startDate, 
                            tileid,
                            vesselType
                        };
                    }));
                }


                const dimensionsNode = self.getRawNodeValue(params.data(), self.dataConfig.dimensions); 
                if(Array.isArray(dimensionsNode)) {
                    self.dimensions(dimensionsNode.map(x => {
                        const measurementUnit = self.getNodeValue(x, 'dimension', 'dimension measurement unit');
                        const type = self.getNodeValue(x, 'dimension', 'dimension type');
                        const qualifier = self.getNodeValue(x, 'dimension', 'dimension type qualifier');
                        const value = self.getNodeValue(x, 'dimension', 'dimension value');
                        const tileid = self.getTileId(x);

                        return { 
                            measurementUnit,
                            type,
                            qualifier,
                            value,
                            tileid
                        };
                    }));
                }

                const componentsNode = self.getRawNodeValue(params.data(), 'components');
                if(Array.isArray(componentsNode)) {
                    self.components(componentsNode.map(x => {
                        const constructionPhase = self.getNodeValue(x, { 
                            testPaths:[
                                ['associated area phase'],
                                ['associated asset construction phase'],
                            ]}
                        );
                        const component = self.getNodeValue(x, 'component', 'component type');
                        const material = self.getNodeValue(x, 'component', 'component material');
                        const technique = self.getNodeValue(x, 'construction technique');
                        const evidence = self.getNodeValue(x,  { 
                            testPaths:[
                                ['component attribute assignment', 'evidence type'],
                                ['component attribute assignment', 'component evidence type'],
                            ]}
                        );
                        const tileid = self.getTileId(x);

                        return { 
                            constructionPhase,
                            component,
                            material,
                            technique,
                            evidence,
                            tileid
                        };
                    }));
                }
                if(self.dataConfig.usePhase) {
                    const usePhaseNode = self.getRawNodeValue(params.data(), 'use phase') || []; 
                    
                    self.usePhases(usePhaseNode.map(x => {
                        var type = self.getNodeValue(x, {
                            testPaths: [
                                ['use phase classification', 'functional type'],
                                ['use phase classification', 'functional  craft type']
                            ]
                        });
                        const period = self.getNodeValue(x, 'use phase period');
                        const startDate = self.getNodeValue(x, 'use phase timespan', 'use phase start date');
                        const endDate = self.getNodeValue(x, 'use phase timespan', 'use phase end date');
                        const dateQualifier = self.getNodeValue(x, 'use phase timespan', 'use phase date qualifier');
                        const displayDate = self.getNodeValue(x, 'use phase display date');
                        const useEvidence = self.getNodeValue(x, 'use phase classification', 'use phase evidence type');
                        const descriptionType = self.getNodeValue(x, 'use phase classification', 'use phase classification description', 'use phase description type');
                        const description = self.getRawNodeValue(x, 'use phase classification', 'use phase classification description', 'use phase description', '@display_value');
                        const tileid = self.getTileId(x);
                        return {
                            type,
                            period,
                            startDate,
                            endDate,
                            dateQualifier,
                            displayDate,
                            useEvidence,
                            descriptionType,
                            description,
                            tileid
                        };
                    }));
                }

                const organizationFormationNode = self.getRawNodeValue(params.data(), self.dataConfig.organizationFormation); 
                if(Array.isArray(organizationFormationNode)) {
                    self.organizationFormation(organizationFormationNode.map(x => {
                        const startDate = self.getNodeValue(x,'timespan', 'start date');
                        const endDate = self.getNodeValue(x, 'timespan', 'end date');
                        const dateQualifier = self.getNodeValue(x, 'timespan', 'date qualifier');
                        const organizationType = self.getNodeValue(x, 'organization type');
                        const tileid = self.getTileId(x);
                        return {
                            startDate,
                            endDate, 
                            tileid, 
                            organizationType, 
                            dateQualifier
                        }
                    }));
                }

                const datesNode = self.getRawNodeValue(params.data(), self.dataConfig.dates); 
                if(datesNode) {
                    const startDate = self.getNodeValue(datesNode, 'earliest possible start date');
                    const endDate = self.getNodeValue(datesNode, 'latest possible end date');
                    const tileid = self.getTileId(datesNode);

                    self.dates([{ 
                        startDate,
                        endDate,
                        tileid
                    }]);
                }
            }

        },
        template: classificationsReportTemplate
    });
});