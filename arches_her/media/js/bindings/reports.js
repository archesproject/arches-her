import $ from 'jquery';
import ko from 'knockout';

// apply aria attributes to the element when an observable changes between true and false
// e.g. <div data-bind="onReportSectionToggleAria: visible.names, sectionName: '{% trans "Section Name" %}'"></div>
ko.bindingHandlers.onReportSectionToggleAria = {
    update: function(element, valueAccessor, allBindings) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var sectionName = allBindings.get('sectionName') || '';
        if (value) { // section is expanded
            $(element).attr('aria-expanded', 'true');
            $(element).attr('aria-label', 'Section ' + sectionName + ' expanded');
            $(element).addClass('fa-angle-double-right');
            $(element).removeClass('fa-angle-double-up');


        } else { //collapsed
            $(element).attr('aria-expanded', 'false');
            $(element).attr('aria-label', 'Section ' + sectionName + ' collapsed');
            $(element).removeClass('fa-angle-double-right');
            $(element).addClass('fa-angle-double-up');
        }
    }
};

ko.bindingHandlers.onReportSectionToggleAria.update = ko.bindingHandlers.onReportSectionToggleAria.update.bind(ko.bindingHandlers.onReportSectionToggleAria);