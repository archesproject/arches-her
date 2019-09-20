// define(['knockout',
//         'knockout-mapping',
//         'views/list',
//         'viewmodels/function',
//         'bindings/chosen'],
// function (ko, koMapping, ListView, FunctionViewModel, chosen) {
//     return ko.components.register('views/components/functions/consultation-status-function', {
//         viewModel: function(params) {
//             FunctionViewModel.apply(this, arguments);
//             var self = this;
//             var nodegroups = {};
//             this.cards = ko.observableArray();
//             this.selected_nodegroup = params.config.cons_status_nodegroupid
//             this.selected_nodegroup.subscribe(function(ng){
//               console.log('selected nodegroup id:', ng);
//             });
//             console.log(this.graph.cards);

//             this.graph.cards.forEach(function(card){
//                 // console.log(card);
//                 var found = !!_.find(this.graph.nodegroups, function(nodegroup){
//                     return nodegroup.parentnodegroup_id === card.nodegroup_id
//                 }, this);
//                 if(!found && !(card.nodegroup_id in nodegroups)){
//                     console.log("success:"+card.nodegroup_id);
//                     this.cards.push(card);
//                     nodegroups[card.nodegroup_id] = true;
//                 } else {
//                     console.log('nodegroupid:'+card.nodegroup_id);
//                     console.log('nodegroups:'+nodegroups);
//                 }
//             }, this);

//             window.setTimeout(function(){$("select[data-bind^=chosen]").trigger("chosen:updated")}, 300);
//         },
//         template: {
//             require: 'text!templates/views/components/functions/consultation-status-function.htm'
//         }
//     });
// })
