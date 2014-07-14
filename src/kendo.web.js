(function(f, define){
    define([
        "./kendo.core",
        "./kendo.router",
        "./kendo.view",
        "./kendo.fx",
        "./kendo.dom",
        "./kendo.data.odata",
        "./kendo.data.xml",
        "./kendo.data",
        "./kendo.data.signalr",
        "./kendo.binder",
        "./kendo.validator",
        "./kendo.userevents",
        "./kendo.draganddrop",
        "./kendo.mobile.scroller",
        "./kendo.groupable",
        "./kendo.reorderable",
        "./kendo.resizable",
        "./kendo.sortable",
        "./kendo.selectable",
        "./kendo.button",
        "./kendo.pager",
        "./kendo.popup",
        "./kendo.notification",
        "./kendo.tooltip",
        "./kendo.list",
        "./kendo.calendar",
        "./kendo.datepicker",
        "./kendo.autocomplete",
        "./kendo.dropdownlist",
        "./kendo.combobox",
        "./kendo.multiselect",
        "./kendo.colorpicker",
        "./kendo.columnmenu",
        "./kendo.columnsorter",
        "./kendo.grid",
        "./kendo.listview",
        "./kendo.filebrowser",
        "./kendo.imagebrowser",
        "./kendo.editor",
        "./kendo.numerictextbox",
        "./kendo.maskedtextbox",
        "./kendo.menu",
        "./kendo.editable",
        "./kendo.pivot.fieldmenu",
        "./kendo.filtercell",
        "./kendo.panelbar",
        "./kendo.progressbar",
        "./kendo.tabstrip",
        "./kendo.timepicker",
        "./kendo.toolbar",
        "./kendo.datetimepicker",
        "./kendo.treeview",
        "./kendo.slider",
        "./kendo.splitter",
        "./kendo.upload",
        "./kendo.window",
        "./kendo.scheduler.view",
        "./kendo.scheduler.dayview",
        "./kendo.scheduler.agendaview",
        "./kendo.scheduler.monthview",
        "./kendo.scheduler.recurrence",
        "./kendo.scheduler",
        "./kendo.gantt.list",
        "./kendo.gantt.timeline",
        "./kendo.gantt",
        "./kendo.pivotgrid",
        "./kendo.pivot.configurator",
        "./kendo.angular"
    ], f);
})(function(){
    "bundle all";
}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
