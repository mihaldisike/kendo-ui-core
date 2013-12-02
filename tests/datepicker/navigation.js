(function() {

var DateView = kendo.DateView,
    keys = kendo.keys,
    dateview,
    div, input;

function createCalendar(dateview, options) {
    var calendar = dateview.calendar;

    calendar.destroy();
    calendar.element.remove();

    dateview.calendar = div.kendoCalendar($.extend({ focusOnNav: false}, options)).data("kendoCalendar");
}

module("kendo.ui.DatePicker API", {
    setup: function() {
        kendo.effects.disable();

        kendo.ns = "kendo-";
        div = $("<div />").appendTo(QUnit.fixture);
        input = $("<input />").appendTo(QUnit.fixture);
    },
    teardown: function() {
        kendo.effects.enable();
        kendo.ns = "";

        if (dateview) {
            dateview.destroy();
        }

        if (input.data("kendoDatePicker")) {
            input.data("kendoDatePicker").destroy();
        }
    }
});

test("click enter should raise change event if dateview is closed", function() {
    var datepicker = input.kendoDatePicker().data("kendoDatePicker");

    datepicker.close();

    stub(datepicker, { _change: datepicker._change });

    input.focus().val("10/10/2000");
    datepicker._keydown({
        currentTarget: document.createElement("input"),
        keyCode: keys.ENTER,
        preventDefault: $.noop
    });

    equal(datepicker.calls("_change"), 1);
});

test("navigate down should persist current viewedateviewalue", function() {
    var value = new Date(2000, 10, 10, 22, 22, 22),
        upEvent = { keyCode: keys.UP, ctrlKey: true, preventDefault: $.noop },
        downEvent = { keyCode: keys.DOWN, ctrlKey: true, preventDefault: $.noop };

    dateview = new DateView({
        value: value,
        min: new Date(1999, 10, 10),
        max: new Date(2111, 10, 10),
        start: "month",
        depth: "month"
    });

    createCalendar(dateview);

    dateview.open();

    dateview.move(upEvent);
    dateview.move(upEvent);

    dateview.move(downEvent);
    dateview.move(downEvent);

    equal(+dateview._current, +value);
});

//MONTH View
test("navigate should not move selection if value is bigger than max", function() {
    var event = { keyCode: keys.RIGHT, preventDefault: $.noop },
        date = new Date(2000, 11, 1);

    dateview = new DateView({
        depth: "month",
        start: "month",
        min: new Date(1900, 10, 10),
        value: date,
        max: date
    });

    createCalendar(dateview);

    dateview._calendar();
    dateview.popup.open();
    dateview.move(event);

    equal(+dateview._current, +date);
    equal(dateview.calendar._table.find(".k-state-focused").text(), date.getDate() + "");
});

test("navigate should not move selection if value is less than min", function() {
    var event = { keyCode: keys.LEFT, preventDefault: $.noop },
        date = new Date(2000, 11, 1);

    dateview = new DateView({start: "month", depth: "month", value: date, min: date, max: new Date(2100, 10, 10)});

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.move(event);

    equal(+dateview._current, +date);
    equal(dateview.calendar._table.find(".k-state-focused").text(), date.getDate() + "");

});

test("navigate should focus next day in month view", function() {
    dateview = new DateView({
        start: "month",
        depth: "month",
        min: new Date(1999, 10, 10),
        max: new Date(2111, 10, 10)
    });

    var event = { keyCode: keys.RIGHT, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    kendo.calendar.views[0].setDate(focusedDate, 1);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.move(event);

    equal(dateview.calendar._table.find(".k-state-focused").text(), focusedDate.getDate() + "");

});

test("navigate should focus previous day in month view", function() {
    dateview = new DateView({start: "month", depth: "month", min: new Date(1999, 10, 10), max: new Date(2111, 10, 10)});

    var event = { keyCode: keys.LEFT, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    focusedDate.setDate(focusedDate.getDate() - 1);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.move(event);

    equal(dateview.calendar._table.find(".k-state-focused").text(), focusedDate.getDate() + "");
});

test("navigate should focus day on previous row in month view", function() {
    dateview = new DateView({start: "month", depth: "month", min: new Date(1999, 10, 10), max: new Date(2111, 10, 10)});

    var event = { keyCode: keys.UP, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    focusedDate.setDate(focusedDate.getDate() - 7);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.move(event);

    equal(dateview.calendar._table.find(".k-state-focused").text(), focusedDate.getDate() + "");
});

test("navigate should focus day on next row in month view", function() {
    dateview = new DateView({start: "month", depth: "month", min: new Date(1999, 10, 10), max: new Date(2111, 10, 10)});

    var event = { keyCode: keys.DOWN, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    focusedDate.setDate(focusedDate.getDate() + 7);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.move(event);

    equal(dateview.calendar._table.find(".k-state-focused").text(), focusedDate.getDate() + "");
});

//YEAR VIEW
test("navigate should focus next month in year view", function() {
    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1999, 10, 10), max: new Date(2111, 10, 10)});

    var event = { keyCode: keys.RIGHT, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.calendar.navigateUp();

    focusedDate.setMonth(focusedDate.getMonth() + 1);

    dateview.move(event);

    equal(dateview.calendar._table.find(".k-state-focused").text(), "Dec");
});

test("navigate should focus previous month in year view", function() {
    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1999, 10, 10), max: new Date(2111, 10, 10)});

    var event = { keyCode: keys.LEFT, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.calendar.navigateUp();

    focusedDate.setMonth(focusedDate.getMonth() - 1);

    dateview.move(event);

    equal(+dateview._current, +focusedDate);
    equal(dateview.calendar._table.find(".k-state-focused").text(), "Oct");
});

test("navigate should focus month on previous row in year view", function() {
    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1999, 10, 10), max: new Date(2111, 10, 10)});

    var event = { keyCode: keys.UP, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.calendar.navigateUp();

    focusedDate.setMonth(focusedDate.getMonth() - 4);

    dateview.move(event);

    equal(+dateview._current, +focusedDate);
    equal(dateview.calendar._table.find(".k-state-focused").text(), "Jul");
});

test("navigate should focus month on next row in year view", function() {
    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1999, 10, 10), max: new Date(2111, 10, 10)});

    var event = { keyCode: keys.DOWN, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.calendar.navigateUp();

    focusedDate.setMonth(focusedDate.getMonth() + 4);

    dateview.move(event);

    equal(+dateview._current, +focusedDate);
    equal(dateview.calendar._table.find(".k-state-focused").text(), "Mar");
});

//DECADE VIEW
test("navigate should focus next year in decade view", function() {
    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1999, 10, 10), max: new Date(2111, 10, 10)});

    var event = { keyCode: keys.RIGHT, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.calendar.navigate(null, "decade");

    focusedDate.setFullYear(focusedDate.getFullYear() + 1);

    dateview.move(event);

    equal(+dateview._current, +focusedDate);
    equal(dateview.calendar._table.find(".k-state-focused").text(), "2001");

});

test("navigate should focus previous year in decade view", function() {
    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1999, 10, 10), max: new Date(2111, 10, 10)});

    var event = { keyCode: keys.LEFT, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.calendar.navigate(null, "decade");

    focusedDate.setFullYear(focusedDate.getFullYear() - 1);

    dateview.move(event);

    equal(+dateview._current, +focusedDate);
    equal(dateview.calendar._table.find(".k-state-focused").text(), "1999");
    ok(!dateview.calendar._table.find(".k-state-focused").hasClass("k-other-month"));
});

test("navigate should focus year on previous row in decade view", function() {
    dateview = new DateView({
        depth: "month",
        start: "month",
        value: new Date(2000, 10, 10),
        min: new Date(1900, 10, 10),
        max: new Date(2111, 10, 10)
    });

    var event = { keyCode: keys.UP, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.calendar.navigate(null, "decade");

    focusedDate.setFullYear(focusedDate.getFullYear() - 4);

    dateview.move(event);

    equal(+dateview._current, +focusedDate);
    equal(dateview.calendar._table.find(".k-state-focused").text(), "1996");
});

test("navigate should focus year on next row in decade view", function() {
    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1900, 10, 10), max: new Date(2111, 10, 10)});

    var event = { keyCode: keys.DOWN, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.calendar.navigate(null, "decade");

    focusedDate.setFullYear(focusedDate.getFullYear() + 4);

    dateview.move(event);

    equal(+dateview._current, +focusedDate);
    equal(dateview.calendar._table.find(".k-state-focused").text(), "2004");
});

//CENTURY VIEW
test("navigate should focus next decade in century view", function() {
    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1900, 10, 10), max: new Date(2111, 10, 10)});

    var event = { keyCode: keys.RIGHT, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.calendar.navigate(null, "century");

    focusedDate.setFullYear(focusedDate.getFullYear() + 10);

    dateview.move(event);

    equal(+dateview._current, +focusedDate);
    equal(dateview.calendar._table.find(".k-state-focused").text(), "2010 - 2019");
});

test("navigate should focus previous decade in century view", function() {
    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1900, 10, 10), max: new Date(2111, 10, 10)});

    var event = { keyCode: keys.LEFT, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.calendar.navigate(null, "century");

    focusedDate.setFullYear(focusedDate.getFullYear() - 10);

    dateview.move(event);

    equal(+dateview._current, +focusedDate);
    equal(dateview.calendar._table.find(".k-state-focused").text(), "1990 - 1999");
});

test("navigate should focus decade on previous row in century view", function() {
    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1900, 10, 10), max: new Date(2111, 10, 10)});

    var event = { keyCode: keys.UP, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.calendar.navigate(null, "century");

    focusedDate.setFullYear(focusedDate.getFullYear() - 40);

    dateview.move(event);

    equal(+dateview._current, +focusedDate);
    equal(dateview.calendar._table.find(".k-state-focused").text(), "1960 - 1969");
});

test("navigate should focus decade on next row in century view", function() {
    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1900, 10, 10), max: new Date(2111, 10, 10)});

    var event = { keyCode: keys.DOWN, preventDefault: $.noop },
        focusedDate = new Date(dateview._current);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.calendar.navigate(null, "century");

    focusedDate.setFullYear(focusedDate.getFullYear() + 40);

    dateview.move(event);

    equal(+dateview._current, +focusedDate);
    equal(dateview.calendar._table.find(".k-state-focused").text(), "2040 - 2049");
});

//Navigate through views
test("navigate down", function() {
    var event = { keyCode: keys.DOWN, ctrlKey: true, preventDefault: $.noop };

    dateview = new DateView({
        value: new Date(2000, 10, 10),
        start: "month",
        depth: "month",
        min: new Date(1900, 10, 10),
        max: new Date(2111, 10, 10)
    });

    createCalendar(dateview);
    stub(dateview.calendar, { navigateDown: dateview.calendar.navigateDown });
    dateview._calendar();
    dateview.popup.open();
    dateview.calendar.navigateUp();

    dateview.calendar._focus(dateview._current);

    dateview.move(event);

    equal(dateview.calendar.calls("navigateDown"), 1);
});

test("navigate up", function() {
    var event = { keyCode: keys.UP, ctrlKey: true, preventDefault: $.noop };

    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1900, 10, 10), max: new Date(2111, 10, 10)});

    stub(dateview.calendar, "navigateUp");

    dateview._calendar();
    dateview.popup.open();
    dateview.move(event);

    equal(dateview.calendar.calls("navigateUp"), 1);
});

test("navigate down selects date", function() {
    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1900, 10, 10), max: new Date(2111, 10, 10)});

    var event = { keyCode: keys.DOWN, ctrlKey: true, preventDefault: $.noop },
        selectedDate = new Date(2000, 10, 15);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.calendar._focus(selectedDate);

    dateview.move(event);

    equal(+dateview.calendar.value(), +selectedDate);
});

test("navigate left", function() {
    var event = { keyCode: keys.LEFT, ctrlKey: true, preventDefault: $.noop };

    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1900, 10, 10), max: new Date(2111, 10, 10)});

    createCalendar(dateview);
    stub(dateview.calendar, "navigateToPast");

    dateview._calendar();
    dateview.popup.open();
    dateview.move(event);

    equal(dateview.calendar.calls("navigateToPast"), 1);
});

test("navigate right", function() {
    var event = { keyCode: keys.RIGHT, ctrlKey: true, preventDefault: $.noop };

    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1900, 10, 10), max: new Date(2111, 10, 10)});

    createCalendar(dateview);
    stub(dateview.calendar, "navigateToFuture");

    dateview._calendar();
    dateview.popup.open();
    dateview.move(event);

    equal(dateview.calendar.calls("navigateToFuture"), 1);
});

test("Home should focus first day of current month", function() {
    var event = { keyCode: keys.HOME, preventDefault: $.noop };

    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1900, 10, 10), max: new Date(2111, 10, 10)});

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.move(event);

    var value = dateview.calendar.element.find(".k-state-focused").children(":first").attr("data-kendo-value");

    equal(value, "2000/10/1");
});

test("End should focus last day of current month", function() {
    var event = { keyCode: keys.END, preventDefault: $.noop };

    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1900, 10, 10), max: new Date(2111, 10, 10)});

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    dateview.move(event);

    var value = dateview.calendar.element.find(".k-state-focused").children(":first").attr("data-kendo-value");

    equal(value, "2000/10/30");
});

test("PageUp should focus same day in previous month", function() {
    var event = { keyCode: keys.PAGEUP, preventDefault: $.noop };

    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1900, 10, 10), max: new Date(2111, 10, 10)});

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();
    stub(dateview.calendar, {navigateToPast: dateview.calendar.navigateToPast});

    dateview.move(event);

    equal(dateview.calendar.calls("navigateToPast"), 1);
});

test("PageDown should focus same day in next month", function() {
    var event = { keyCode: keys.PAGEDOWN, preventDefault: $.noop };

    dateview = new DateView({value: new Date(2000, 10, 10), start: "month", depth: "month", min: new Date(1900, 10, 10), max: new Date(2111, 10, 10)});

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();

    stub(dateview.calendar, {navigateToFuture: dateview.calendar.navigateToFuture});

    dateview.move(event);

    equal(dateview.calendar.calls("navigateToFuture"), 1);
});

test("Enter should close date if select date", function() {
    var event = { keyCode: keys.ENTER, preventDefault: $.noop };

    dateview = new DateView({
        anchor: $("<input />"),
        value: new Date(2000, 10, 10),
        min: new Date(1900, 10, 10),
        max: new Date(2100, 10, 10),
        start: "month",
        depth: "month"
    });

    createCalendar(dateview);
    dateview.open();

    dateview.calendar._focus(dateview._current);

    dateview.move(event);

    ok(!dateview.popup.visible());
});

test("Enter should focus viewedDate", function() {
    var event = { keyCode: keys.ENTER, preventDefault: $.noop };

    dateview = new DateView({
        anchor: $("<input />"),
        value: new Date(2000, 10, 10),
        min: new Date(1900, 10, 10),
        max: new Date(2100, 10, 10),
        start: "month",
        depth: "month"
    });

    createCalendar(dateview);
    dateview.open();

    dateview.calendar.navigate(new Date(2000, 10, 10), "year");
    dateview.calendar._focus(dateview._current);
    dateview.move(event);

    ok(dateview.popup.visible());
    equal(dateview.calendar._table.find(".k-state-focused").length, 1);
});

test("Enter should select date", function() {
    dateview = new DateView({
        anchor: $("<input />"),
        value: new Date(2000, 10, 10),
        min: new Date(1900, 10, 10),
        max: new Date(2100, 10, 10),
        start: "month",
        depth: "month"
    });

    var called, event = { keyCode: keys.ENTER, preventDefault: $.noop },
    focused = new Date(2000, 10, 11);

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();

    stub(dateview.calendar, {navigateDown: dateview.calendar.navigateDown});

    dateview.calendar._focus(focused);
    dateview.move(event);

    equal(+dateview.calendar.args("navigateDown")[0], +focused);
});

test("Enter should navigate down", function() {
    var event = { keyCode: keys.ENTER, preventDefault: $.noop };

    dateview = new DateView({
        anchor: $("<input />"),
        value: new Date(2010, 10, 10),
        min: new Date(1900, 10, 10),
        max: new Date(2100, 10, 10),
        start: "month",
        depth: "month"
    });

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();

    stub(dateview.calendar, {navigateDown: dateview.calendar.navigateDown});

    dateview.calendar.navigateUp();
    dateview.calendar._focus(dateview._current);

    dateview.move(event);

    equal(dateview.calendar.calls("navigateDown"), 1);
});

test("Esc should close dateView", function() {
    var event = { keyCode: keys.ESC, preventDefault: $.noop };

    dateview = new DateView({
        anchor: $("<input />"),
        value: new Date(2000, 10, 10),
        min: new Date(1900, 10, 10),
        max: new Date(2100, 10, 10),
        start: "month",
        depth: "month"
    });

    createCalendar(dateview);
    dateview._calendar();
    dateview.popup.open();

    stub(dateview.popup, "close");

    dateview.move(event);

    equal(dateview.popup.calls("close"), 1);
});

test("type invalide date does not clear input", function() {
    datepicker = input.kendoDatePicker({value: new Date()}).data("kendoDatePicker");

    var value = "invalid date";

    input.focus().val(value).blur();

    equal(input.val(), value);
    equal(datepicker.value(), null);
});

test("click on selected date should close the dateView", 1, function() {
    dateview = new DateView({
        min: new Date(1800, 1, 1),
        max: new Date(2800, 1, 1),
        start: "month",
        depth: "month",
        anchor: $("<input />"),
        clearBlurTimeout: $.noop,
        close: function() {
            ok(true);
        }
    });

    createCalendar(dateview);
    dateview.value(new Date());
    dateview.popup.open();
    dateview.open();

    dateview.calendar
      .element
      .find(".k-state-selected")
      .click();
});

test("Alt + Down should open the calendar", function() {
    var event = { type: "keydown", keyCode: keys.DOWN, altKey: true, preventDefault: $.noop };

    datepicker = input.kendoDatePicker().data("kendoDatePicker");

    stub(datepicker.dateView, "open");

    input.trigger(event);

    equal(datepicker.dateView.calls("open"), 1);
});

test("Alt + UP should close the calendar", function() {
    var event = { type: "keydown", keyCode: keys.UP, altKey: true, preventDefault: $.noop };

    datepicker = input.kendoDatePicker().data("kendoDatePicker");

    stub(datepicker.dateView, "close");

    input.trigger(event);

    equal(datepicker.dateView.calls("close"), 1);
});

test("DatePicker does not update the input if the entered value is the same but in diff format", function() {
    datepicker = input.kendoDatePicker({
        format: "dd MMM yyyy",
        parseFormats: ["yyyy/MM/dd"],
        value: kendo.toString(today, "dd MMM yyyy")
    }).data("kendoDatePicker");

    var today = new Date(),
        todayDiffFormat = kendo.toString(today, "yyyy/MM/dd");

    input.val(todayDiffFormat);

    //simulate change
    datepicker._change(input.val());

    equal(input.val(), kendo.toString(today, "dd MMM yyyy"));
});

test("DatePicker does not call change on blur if no text change", function() {
    var date = new Date(1919, 0, 1);

    datepicker = input.kendoDatePicker({
        format: "MM/dd/yy",
        value: new Date(date)
    }).data("kendoDatePicker");

    datepicker.options.parseFormats = ["MM/dd/yyyy", "MM/dd/yy"];

    //simulate change
    input.focus().blur();

    equal(+datepicker.value(), +date);
});

test("DatePicker does not call change on ENTER if no text change", function() {
    var date = new Date(1919, 0, 1);

    datepicker = input.kendoDatePicker({
        format: "MM/dd/yy",
        value: new Date(date)
    }).data("kendoDatePicker");

    datepicker.options.parseFormats = ["MM/dd/yyyy", "MM/dd/yy"];

    //simulate change
    input.focus().trigger({
        type: "keydown",
        keyCode: kendo.keys.ENTER
    });

    equal(+datepicker.value(), +date);
});

test("DatePicker does set focused date of calendar if no text change", function() {
    var date = new Date(1919, 0, 1);

    datepicker = input.kendoDatePicker({
        format: "MM/dd/yy",
        value: new Date(date)
    }).data("kendoDatePicker");

    datepicker.options.parseFormats = ["MM/dd/yyyy", "MM/dd/yy"];

    input.focus();
    datepicker.open();

    equal(+datepicker.dateView._current, +date);
});

})();
