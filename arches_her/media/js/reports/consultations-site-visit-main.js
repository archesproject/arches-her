define([
    'knockout',
    'templates/views/components/reports/consultations-site-visit-main.htm'
], function(ko, consultationsSiteVisitMainReportTemplate) {
    ko.components.register('consultations-site-visit-main', {
        viewModel: function(params) {
            this.activeCards = params.activeCards;
            this.visits = ko.computed(function() {
                return ko.unwrap(params.tiles).filter(function(tile) {
                    return ko.unwrap(tile.nodegroup_id) === '066cb8f0-a251-11e9-85d5-00224800b26d';
                }).map(function(tile) {
                    var cards = {};
                    cards.attendees = [];
                    tile.cards.forEach(function(card) {
                        card.tiles().forEach(function(t) {
                            var data = t.data;
                            if (data['bef92340-a251-11e9-81db-00224800b26d'])
                                cards.observation = ko.unwrap(data['bef92340-a251-11e9-81db-00224800b26d']);
                            if (data['cbf8ed4f-a251-11e9-8f8c-00224800b26d'])
                                cards.recommendation = ko.unwrap(data['cbf8ed4f-a251-11e9-8f8c-00224800b26d']);
                            if (data['77d5e72e-d0d6-11e9-bdab-a683e74f6c3a'])
                                cards.photos = card;
                            if (data['ab622f1f-a251-11e9-bda5-00224800b26d'])
                                cards.attendees.push(ko.unwrap(data['ab622f1f-a251-11e9-bda5-00224800b26d']));
                        });
                    });
                    return {
                        tileid: tile.tileid,
                        date: tile.data['299e6d51-a251-11e9-9eb6-00224800b26d'],
                        attendees: tile.data['ab622f1f-a251-11e9-bda5-00224800b26d'],
                        locationdescription: tile.data['3f18a065-a251-11e9-aa8a-00224800b26d'],
                        cardlookup: cards,
                        cards: tile.cards
                    };
                });
            });
        },
        template: consultationsSiteVisitMainReportTemplate
    });
});
