"""
ARCHES - a program developed to inventory and manage immovable cultural heritage.
Copyright (C) 2013 J. Paul Getty Trust and World Monuments Fund

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
"""

from arches.app.models.graph import Graph
from arches.app.models.card import Card
from arches.app.models.system_settings import settings
from django.core.management.base import BaseCommand, CommandError
from django.core.cache import cache
from arches.app.utils.betterJSONSerializer import JSONSerializer
from pprint import pprint as pp


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument("operation", nargs="?", help="")

    def handle(self, *args, **options):
        self.run()

    def get_cards(self, cards, output):
        self.nodegroupids = []
        for cardmodel in cards:
            card = Card.objects.get(pk=cardmodel.cardid)
            if len(card.cards) > 0:
                self.get_cards(card.cards, output)
            output.append(card)
        return [card.name for card in output]

    def run(self):
        graph = Graph.objects.get(pk = '8d41e49e-a250-11e9-9eab-00224800b26d')
        cards = graph.cardmodel_set.filter(nodegroup__parentnodegroup = None).order_by("sortorder")
        res = self.get_cards(cards, [])
        pp(res)







