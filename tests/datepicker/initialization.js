(function() {

var DateView = kendo.DateView;
var div;

//QUnit.config.testTimeout = 800;

module("kendo.ui.DateView initialization", {
    setup: function() {
        kendo.ns = "kendo-";
        kendo.effects.disable();

        div = $("<div />").appendTo(QUnit.fixture);
    },
    teardown: function() {
        kendo.ns = "";
        kendo.effects.enable();
    }
});

test("DateView re-assigns shared calendar", function() {
    var options = {
        anchor: $("<input/>"),
        value: new Date (2000, 10, 10),
        footer: '#= kendo.toString(data,"D") #',
        min: new Date (1900, 10, 10),
        max: new Date (2100, 10, 10),
        change: function() {},
        open: function() {},
        close: function() {},
        start: "month",
        depth: "month",
        culture: "bg-BG"
    },
    dv1 = new DateView({
        value: new Date(),
        min: new Date(),
        max: new Date(),
        footer: '#= kendo.toString(data,"D") #',
        start: "month",
        depth: "month"
    }),
    dv2 = new DateView(options);

    dv2._calendar();

    var calendar = dv1.calendar,
        popup = dv2.popup;

    equal(calendar.options.culture, options.culture);
    equal(+calendar.options.min, +options.min);
    equal(+calendar.options.max, +options.max);
    equal(calendar._events["change"][0], options.change);
    equal(calendar.element.data("dateView"), dv2);

    equal(popup.options.anchor, dv2.options.anchor);
    equal(popup._events["open"][0], dv2.options.open);
    equal(popup._events["close"][0], dv2.options.close);
});

test("DateView build templates", function() {
    var dateView = new DateView();

    ok(dateView.month);
    ok(dateView.month.content);
    ok(dateView.month.empty);
});

test("DateView build footer template", function() {
    var dateView = new DateView({
        footer: '#= kendo.toString(data,"D") #'
    });

    ok(dateView.footer);
});

test("DateView's footer template honors options.culture", function() {
    var dateView = new DateView({
        culture: "bg-BG"
    }),
    today = new Date();

    equal(dateView.footer(today), kendo.toString(today, "D", "bg-BG"));
});

test("DateView sets the calendar.month templates", function() {
    var dateView = new DateView({
        month: {
            content: "<div>#=data.value#</div>"
        }
    });

    dateView._calendar();

    equal(dateView.calendar.month.content({}), dateView.month.content({}));
});

test("DateView change the footer using its footer template", function() {
    var dateView = new DateView({
        footer: "template"
    });

    dateView.calendar = new kendo.ui.Calendar($("<div/>"));
    dateView._calendar();

    equal(dateView.calendar._today.html(), "template");
});

test("DateView should create shared calendar", function() {
    var dateView = new DateView();

    ok(dateView.calendar);
});

test("DateView should create popup instance", function() {
    var dateView = new DateView();

    ok(dateView.popup);
});

test("DateView persist focused value when calendar navigate", function() {
    var called = false,
        date = new Date(2000, 10, 10),
        dv1 = new DateView({
            value: date,
            min: date,
            max: date,
            start: "month"
        });

    dv1._calendar();
    dv1.calendar.navigate(date, "month");

    equal(dv1.calendar._table.find(".k-state-focused").children().attr("data-kendo-value"), "2000/10/10");
    equal(+dv1._current, +dv1.calendar._current);
});

var input;
var DatePicker = kendo.ui.DatePicker;

module("kendo.ui.DatePicker initialization", {
    setup: function() {
        kendo.ns = "kendo-";
        kendo.effects.disable();

        input = $("<input />").appendTo(QUnit.fixture);
    },
    teardown: function() {
        kendo.ns = "";
        kendo.effects.enable();
    }
});

test("DatePicker should not create footer template", function() {
    var datepicker = input.kendoDatePicker({
        footer: false
    }).data("kendoDatePicker");

    deepEqual(datepicker.dateView.footer, undefined);
});

test("get value of the input if", function() {
    input.val("10/10/2000");

    var datepicker = new DatePicker(input);

    equal(+datepicker.value(), +new Date(2000, 9, 10));
});

test("_wrapper() wraps input element", function() {
    input.css("width", "200");

    var datepicker = input.kendoDatePicker().data("kendoDatePicker");

    ok(input.parent().hasClass("k-picker-wrap k-state-default"));
    equal(datepicker.wrapper.attr("class"), "k-widget k-datepicker k-header");
});

test("_input should add k-input to the element", function() {
    var datepicker = input.kendoDatePicker().data("kendoDatePicker");

    ok(datepicker.element.hasClass("k-input"));
});

test("_input create calendar button", function() {
    var datepicker = input.kendoDatePicker().data("kendoDatePicker"),
        icon = datepicker.wrapper.find(".k-select");

    ok(icon);
    ok(icon.is("span"));
    ok(icon.hasClass("k-select"));
    ok(icon.children().is("span"));
    ok(icon.children().hasClass("k-icon k-i-calendar"));
    ok(icon.children().html());
});

test("create dateview", function() {
    var datepicker = input.kendoDatePicker().data("kendoDatePicker");

    ok(datepicker.dateView);
});

test("dateView should have correct options", function() {
    var datepicker = input.kendoDatePicker({open: function() {}, close: $.noop}).data("kendoDatePicker"),
        dateView = datepicker.dateView,
        options = dateView.options,
        dpOptions = datepicker.options;

    ok(dateView.options);
    equal(options.anchor, datepicker.wrapper);
    equal(options.value, dpOptions.value);
    equal(+options.min, +dpOptions.min);
    equal(+options.max, +dpOptions.max);
    notEqual(options.change, dpOptions.change);
});

test("dateView onChange should call value()", function() {
    var called = false,
        datepicker = input.kendoDatePicker().data("kendoDatePicker");

    stub(datepicker, {
        _change: datepicker.value,
        close: datepicker.close
    });

    $.proxy(datepicker.dateView.options.change, datepicker.dateView.calendar)();

    equal(datepicker.calls("_change"), 1);
    equal(datepicker.calls("close"), 1);
});

test("DatePicker wire icon click", function() {
    var datepicker = input.kendoDatePicker().data("kendoDatePicker");

    datepicker.close();
    datepicker._dateIcon.click();
    ok(datepicker.dateView.popup.visible());
});

asyncTest("form reset support", 2, function() {
    input.attr("value", "12/12/2000");

    var form = $("<form/>").appendTo(document.body).append(input),
        datepicker = input.kendoDatePicker().data("kendoDatePicker");

    datepicker.open();
    datepicker.value("12/12/2010");

    form[0].reset();

    setTimeout(function() {
        equal(datepicker.element.val(), "12/12/2000");
        equal(datepicker.dateView.calendar.value().getFullYear(), "2000");
        start();
    }, 200);
});

asyncTest("support for form defined by attribute", 2, function() {
    input.attr("form", "form1").attr("value", "12/12/2000");

    var form = $("<form id='form1'/>").appendTo(document.body),
        datepicker = input.kendoDatePicker().data("kendoDatePicker");

    datepicker.open();
    datepicker.value("12/12/2010");

    form[0].reset();

    setTimeout(function() {
        equal(datepicker.element.val(), "12/12/2000");
        equal(datepicker.dateView.calendar.value().getFullYear(), "2000");
        start();
    }, 200);
});


test("extend popup options if datepicker.options.popup", function() {
    var appendTo = "body",
        datepicker = new kendo.ui.DatePicker(input, {
            popup: {
                appendTo: appendTo
            }
        });

    equal(datepicker.dateView.popup.options.appendTo[0], $(appendTo)[0]);
});

test("DatePicker adds format to parseFormats array", function() {
    var datepicker = input.kendoDatePicker({
        parseFormats: ["MM/dd/yy"]
    }).data("kendoDatePicker");

    equal(datepicker.options.parseFormats[0], datepicker.options.format);
    equal(datepicker.options.parseFormats[1], "MM/dd/yy");
});

test("DatePicker does not modify parseFormats if format exists in the array", function() {
    var datepicker = input.kendoDatePicker({
        format: "MM/dd/yy",
        parseFormats: ["MM/dd/yyyy", "MM/dd/yy"]
    }).data("kendoDatePicker");

    equal(datepicker.options.parseFormats.length, 2);
    equal(datepicker.options.parseFormats[0], "MM/dd/yyyy");
    equal(datepicker.options.parseFormats[1], datepicker.options.format);
});

test("DatePicker copies input's className to the wrapper", function() {
    var datepicker = input.addClass("test").kendoDatePicker().data("kendoDatePicker");

    ok(datepicker.wrapper.hasClass("test"));
});

test("DatePicker updates calendar if empty input element on open", function() {
    var datepicker = input.kendoDatePicker().data("kendoDatePicker");

    datepicker.value(new Date());

    input.focus().val("");
    datepicker.open();

    equal(datepicker.dateView.calendar.value(), null);
});

test("DatePicker updates calendar's focused date", function() {
    var datepicker = input.kendoDatePicker().data("kendoDatePicker"),
        date = new Date(2000, 10, 10);

    datepicker.value(new Date(2000, 9, 1));

    input.focus().val(kendo.toString(date, "MM/dd/yyyy"));
    datepicker.open();

    var link = datepicker.dateView.calendar.element.find(".k-state-focused > .k-link");

    equal(+datepicker.dateView.calendar.value(), +datepicker.value());
    equal(link.html(), date.getDate());
});

if (!kendo.support.touch) {
    test("DatePickers changes the type of the input", function() {
        var input = $("<input type='date'/>"),
            datepicker = input.kendoDatePicker().data("kendoDatePicker");

        equal(datepicker.element[0].type, "text");
        equal(datepicker.element.attr("type"), "text");
    });
}

test("DatePicker sets dates property of the calendar", function() {
    var dates =  [new Date(2000, 10, 10)],
        datepicker = input.kendoDatePicker({
            dates: dates
        }).data("kendoDatePicker");

    datepicker.open();

    ok(datepicker.dateView.calendar.options.dates[0]);
});

test("DatePicker honors readonly attribute", function() {
    var datepicker = input.attr("readonly", true).kendoDatePicker().data("kendoDatePicker");

    stub(datepicker.dateView, {toggle: datepicker.dateView.toggle});

    datepicker.wrapper.find(".k-select").click();

    ok(!datepicker.dateView.popup.visible());
});

test("DatePicker uses disabled attr over the readonly", function() {
    var datepicker = input.attr("readonly", true).attr("disabled", true)
                          .kendoDatePicker().data("kendoDatePicker");

    equal(input.attr("readonly"), undefined);
});

test("DatePicker does not remove input text on initialization if not valid value", function() {
    var datepicker = input.val("test").kendoDatePicker().data("kendoDatePicker");

    equal(datepicker.value(), null);
    equal(input.val(), "test");
});

})();
