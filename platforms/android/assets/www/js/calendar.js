(function ($) {
    $.jqmCalendar = function (element, options, cal) {
        var defaults = {
            // Array of events
            events: [],
            // Event handler,
            eventHandler: {
                // getImportanceOfDay (date, callback).  callback should be called
                // with importance as an argument. Currently, 0 (no events), 1 (e.g.
                // one event) and 2 (more than one event) are supported.
                getImportanceOfDay: getImportanceOfDay,
                // getEventOnDay (begin, end, callback).  callback should be called
                // with the list of events
                getEventsOnDay: getEventsOnDay
            },
            // Default properties for events
            begin: "begin",
            end: "end",
            id: "id",
            isPrivate: "isPrivate",
            summary: "summary",
            bg: "bg", // as per http://stackoverflow.com/questions/18782689/how-to-change-the-background-image-on-particular-date-in-calendar-based-on-event
            itemIndex: "itemIndex",
            icon: "icon",
            url: "url",
            // Sting to use when event is all day
            allDayTimeString: '',
            // Theme
            theme: "c",
            // Date variable to determine which month to show and which date to select
            date: new Date(),
            // Version
            version: "1.0.1",
            // Array of month strings (calendar header)
            months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            // Array of day strings (calendar header)
            days: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
            yearArrow: false,
            disableDates: 0, //0 none, -1 past, +1 future
            // Most months contain 5 weeks, some 6. Set this to six if you don't want the amount of rows to change when switching months.
            weeksInMonth: undefined,
            // Start the week at the day of your preference, 0 for sunday, 1 for monday, and so on.
            startOfWeek: 1,
            // List Item formatter, allows a callback to be passed to alter the contect of the list item
            listItemFormatter: listItemFormatter
        };

        var plugin = this,
            today = new Date();
        plugin.settings = null;

        var $element = $(element).addClass("jq-calendar-wrapper"),
            $table,
            $header,
            $tbody,
            $listview;

        // Parameter added for me to get the events
        function init(cal) {
            plugin.settings = $.extend({}, defaults, options);
            cal.eventsCalendar = plugin.settings.events;        // Added for me
            plugin.settings.theme = $.mobile.getInheritedTheme($element, plugin.settings.theme);

            $table = $("<table/>");

            // Build the header
            var $thead = $("<thead/>").appendTo($table),
                $tr = $("<tr/>").appendTo($thead),
                $th = $("<th class='ui-bar-" + plugin.settings.theme + " header' colspan='7'/>");

            $("<a href='#' data-role='button' data-icon='arrow-l' data-iconpos='notext' class='previous-btn'>Previous</a>").click(function () {
                refresh(new Date(plugin.settings.date.getFullYear(), plugin.settings.date.getMonth() - 1,
                    plugin.settings.date.getDate() <= _daysInMonth(new Date(plugin.settings.date.getFullYear(), plugin.settings.date.getMonth() - 1)) ? plugin.settings.date.getDate() : _daysInMonth(new Date(plugin.settings.date.getFullYear(), plugin.settings.date.getMonth() - 1))

                ));
            }).appendTo($th);

            if (plugin.settings.yearArrow) {
                $("<a href='#' data-role='button' data-icon='arrow-d' data-iconpos='notext' class='previous-btn'>Previous</a>").click(function () {
                    refresh(new Date(plugin.settings.date.getFullYear(), plugin.settings.date.getMonth() - 12,
                        plugin.settings.date.getDate() <= _daysInMonth(new Date(plugin.settings.date.getFullYear(), plugin.settings.date.getMonth() - 12)) ? plugin.settings.date.getDate() : _daysInMonth(new Date(plugin.settings.date.getFullYear(), plugin.settings.date.getMonth() - 12))

                    ));
                }).appendTo($th);
            }

            $header = $("<span/>").appendTo($th);

            $("<a href='#' data-role='button' data-icon='arrow-r' data-iconpos='notext' class='next-btn'>Next</a>").click(function () {
                var newDay = plugin.settings.date.getDate();
                var maxDay = _daysInMonth(new Date(plugin.settings.date.getFullYear(), plugin.settings.date.getMonth() + 1), 0);
                if (newDay > maxDay) { newDay = maxDay; }
                refresh(new Date(plugin.settings.date.getFullYear(), plugin.settings.date.getMonth() + 1, newDay));
            }).appendTo($th);

            if (plugin.settings.yearArrow) {
                $("<a href='#' data-role='button' data-icon='arrow-u' data-iconpos='notext' class='next-btn'>Next</a>").click(function () {
                    refresh(new Date(plugin.settings.date.getFullYear(), plugin.settings.date.getMonth() + 12,
                        plugin.settings.date.getDate() <= _daysInMonth(new Date(plugin.settings.date.getFullYear(), plugin.settings.date.getMonth() + 12)) ? plugin.settings.date.getDate() : _daysInMonth(new Date(plugin.settings.date.getFullYear(), plugin.settings.date.getMonth() + 12))

                    ));
                }).appendTo($th);
            }

            $th.appendTo($tr);

            $tr = $("<tr/>").appendTo($thead);

            // The way of determing the labels for the days is a bit awkward, but works.
            for (var i = 0, days = [].concat(plugin.settings.days, plugin.settings.days).splice(plugin.settings.startOfWeek, 7); i < 7; i++) {
                $tr.append("<th class='ui-bar-" + plugin.settings.theme + "'><span id='nameday" + i + "' class='darker'>" + days[i] + "</span></th>"); //lp20150515
            }

            $tbody = $("<tbody/>").appendTo($table);

            $table.appendTo($element);
            $listview = $("<ul data-role='listview'/>").insertAfter($table);

            // Call refresh to fill the calendar with dates
            refresh(plugin.settings.date);
        }

        function _firstDayOfMonth(date) {
            // [0-6] Sunday is 0, Monday is 1, and so on.
            return (new Date(date.getFullYear(), date.getMonth(), 1)).getDay();
        }

        function _daysBefore(date, fim) {
            // Returns [0-6], 0 when firstDayOfMonth is equal to startOfWeek, else the amount of days of the previous month included in the week.
            var firstDayInMonth = (fim || _firstDayOfMonth(date)),
                diff = firstDayInMonth - plugin.settings.startOfWeek;
            return (diff > 0) ? diff : (7 + diff);
        }

        function _daysInMonth(date) {
            // [1-31]
            return (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();
        }

        function _weeksInMonth(date, dim, db) {
            // Returns [5-6];
            return (plugin.settings.weeksInMonth) ? plugin.settings.weeksInMonth : Math.ceil(((dim || _daysInMonth(date)) + (db || _daysBefore(date))) / 7);
        }

        function getImportanceOfDay(date, callback) {
            var importance = 0;

            // Find events for this date
            for (var i = 0,
                event,
                begin = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
                end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0, 0);
                event = plugin.settings.events[i]; i++) {
                if (event[plugin.settings.end] >= begin && event[plugin.settings.begin] < end) {
                    importance++;
                    var bg = event[plugin.settings.bg];
                    if (importance > 1 || bg) break;
                }
            }
            callback(importance, bg);
        }

        function getEventsOnDay(begin, end, callback) {
            // Find events for this date
            // Callback is called for each event and once at the end without an event. 
            var ret_list = [];
            for (var i = 0, event; event = plugin.settings.events[i]; i++) {
                if (event[plugin.settings.end] >= begin && event[plugin.settings.begin] < end) {
                    // Append matches to list
                    ret_list[ret_list.length] = event;
                }
            }
            // Callback one more time to handle any cleanup.
            callback(ret_list);
        }

        function addCell($row, date, darker, selected) {
            var $td = $("<td class='ui-body-" + plugin.settings.theme + "'/>").appendTo($row),
                $a = $("<button href='#' class='ui-btn ui-btn-up-" + plugin.settings.theme + "'/>")
                    .html(date.getDate().toString())
                    .data('date', date)
                    .click(cellClickHandler)
                    .taphold(cellTapholdHandler)
                    .appendTo($td);

            if (selected) $a.click();

            if (darker) {
                $td.addClass("darker");
            }

            $a.attr("disabled", isDisabled(date));

            plugin.settings.eventHandler.getImportanceOfDay(date,
                function (importance, bg) {
                    if (importance > 0) {
                        $a.append("<span>&bull;</span>");
                    }

                    if (date.getFullYear() === today.getFullYear() &&
                        date.getMonth() === today.getMonth() &&
                        date.getDate() === today.getDate()) {
                        $a.addClass("ui-btn-today");
                    } else {

                        if (bg) {/* 2014113: added bg definition based on event "bg"
			      if bg specified in one event it will prevail on "importance-?" class
			      Open point:
			      There can be more than one event per day. Which one drives the color of the day?
			      As per actual implementation it's the first event.
			   */

                            $a.addClass(bg);
                        } else {
                            $a.addClass("importance-" + importance.toString());
                        }
                    }
                });
        }

        function cellTapholdHandler() {
            var $this = $(this),
                date = $this.data('date');
            /* Added for me */
            document.getElementById("startDate").value = getDateFormated(date);
            document.getElementById("endDate").value = getDateFormated(date);
            /* -------------*/
            $tbody.find("button.ui-btn-active").removeClass("ui-btn-active");
            $this.addClass("ui-btn-active");

            if (date.getMonth() !== plugin.settings.date.getMonth()) {
                // Go to previous/next month
                refresh(date);
            }
            // Select new date
            $element.trigger('change', date);
            $element.trigger('taphold', date);

            plugin.settings.date = date;
        }


        function cellClickHandler() {
            var $this = $(this),
                date = $this.data('date');
            /* Added for me */
            document.getElementById("startDate").value = getDateFormated(date);
            document.getElementById("endDate").value = getDateFormated(date);
            /* -------------*/
            $tbody.find("button.ui-btn-active").removeClass("ui-btn-active");
            $this.addClass("ui-btn-active");

            if (date.getMonth() !== plugin.settings.date.getMonth()) {
                // Go to previous/next month
                refresh(date);
            } else {
                // Select new date
                $element.trigger('change', date);
            }
            plugin.settings.date = date;
        }

        function isDisabled(date) {
            if ((plugin.settings.disableDates == -1 && dateOnly(date) < dateOnly(new Date())) || (plugin.settings.disableDates == 1 && dateOnly(date) > dateOnly(new Date()))) {
                return true;
            }
            return false;
        }

        function dateOnly(date) {
            var day = padd(date.getDate(), 2);
            var month = padd(date.getMonth() + 1, 2);
            var year = date.getFullYear();
            var resultDate = "" + year + month + day;
            return parseInt(resultDate, 10);
        }

        function padd(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }


        function refresh(date) {
            plugin.settings.date = date = date || plugin.settings.date || new Date();

            var year = date.getFullYear(),
                month = date.getMonth(),
                daysBefore = _daysBefore(date),
                daysInMonth = _daysInMonth(date),
                weeksInMonth = plugin.settings.weeksInMonth || _weeksInMonth(date, daysInMonth, daysBefore);

            if (((daysInMonth + daysBefore) / 7) - weeksInMonth === 0)
                weeksInMonth++;

            // Empty the table body, we start all over...
            $tbody.empty();
            // Change the header to match the current month
            $header.html(plugin.settings.months[month] + " " + year.toString());

            for (var weekIndex = 0,
                daysInMonthCount = 1,
                daysAfterCount = 1; weekIndex < weeksInMonth; weekIndex++) {

                var daysInWeekCount = 0,
                    row = $("<tr/>").appendTo($tbody);

                // Previous month
                while (daysBefore > 0) {
                    addCell(row, new Date(year, month, 1 - daysBefore), true);
                    daysBefore--;
                    daysInWeekCount++;
                }

                // Current month
                while (daysInWeekCount < 7 && daysInMonthCount <= daysInMonth) {
                    addCell(row, new Date(year, month, daysInMonthCount), false, daysInMonthCount === date.getDate());
                    daysInWeekCount++;
                    daysInMonthCount++;
                }

                // Next month
                while (daysInMonthCount > daysInMonth && daysInWeekCount < 7) {
                    addCell(row, new Date(year, month, daysInMonth + daysAfterCount), true);
                    daysInWeekCount++;
                    daysAfterCount++;
                }
            }

            //lp20150515
            for (var i = 0, days = [].concat(plugin.settings.days, plugin.settings.days).splice(plugin.settings.startOfWeek, 7); i < 7; i++) {
                document.getElementById('nameday' + i).innerHTML = days[i];
            }


            $element.trigger('create');
        }

        $element.bind('change', function (originalEvent, begin) {
            var end = new Date(begin.getFullYear(), begin.getMonth(), begin.getDate() + 1, 0, 0, 0, 0);
            // Empty the list
            $listview.empty();

            plugin.settings.eventHandler.getEventsOnDay(begin, end, function (list_of_events) {
                for (var i = 0, event; event = list_of_events[i]; i++) {
                    var summary = event[plugin.settings.summary],
                        bg = event[plugin.settings.bg],
                        itemIndex = event[plugin.settings.itemIndex],
                        beginTime = ((event[plugin.settings.begin] > begin) ? event[plugin.settings.begin] : begin).toTimeString().substr(0, 5),
                        endTime = ((event[plugin.settings.end] < end) ? event[plugin.settings.end] : end).toTimeString().substr(0, 5),
                        timeString = beginTime + "-" + endTime,
                        $listItem = $("<li></li>").appendTo($listview);
                    plugin.settings.listItemFormatter($listItem, timeString, summary, event);
                }
                $listview.trigger('create').filter(".ui-listview").listview('refresh');
            });
        });

        function listItemFormatter($listItem, timeString, summary, event) {
            var text = ((timeString != "00:00-00:00") ? timeString : plugin.settings.allDayTimeString) + " " + summary;
            if (event[plugin.settings.icon]) {
                //          $listItem.attr('data-role', 'button');
                // 	    $listItem.attr('data-icon', event.icon);
                // 	    $listItem.attr('data-iconpos', "left");
                $listItem.addClass("ui-icon-" + event.icon);
                $listItem.addClass("ui-btn-icon-right");
            }
            if (event[plugin.settings.bg]) {
                $listItem.addClass(event.bg);
            }
            if (event[plugin.settings.itemIndex]) {
                $listItem.attr('id', 'id' + event.itemIndex);
            }
            if (event[plugin.settings.url]) {
                //$('<a onclick="eventSettings()"></a>').text(text).attr('href', event[plugin.settings.url]).appendTo($listItem);
            } else {
                //$('<a onclick="eventSettings()"></a>').text(text).appendTo($listItem);
                $('<a href="#popupMenuEvent" onclick="selectEvent(this.id)" data-rel="popup" data-transition="turn" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-gear ui-btn-icon-right ui-btn-a"></a>').
                    text(text).attr('id', event.id).appendTo($listItem);
            }
        }

        $element.bind('refresh', function (event, date) {
            refresh(date);
        });

        cal.refreshFunction = refresh;
        init(cal);      // Parameter added for me
    };

    $.fn.jqmCalendar = function (cal, options) {
        return this.each(function () {
            if (!$(this).data('jqmCalendar')) {
                $(this).data('jqmCalendar', new $.jqmCalendar(this, options, cal));
            }
        });
    }

    // Object to get the events and things of the calendar
    var calendar = {
        eventSelected: null,                // Event selected by click
        eventsCalendar: null,               // Have all events
        refreshFunction: null               // Refresh the calendar in the html
    };

    // Create calendar
    $(document).ready(function () {
        $("#calendar").jqmCalendar(calendar, {});
        // Format datepicker
        $("#endDate").datepicker({
            firstDay: 1,
            dayNamesMin: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre"
                , "Noviembre", "Diciembre"],
            onSelect: function (selected, evnt) {
                $("#endDate").val(getDateFormated(selected));
            }
        });
        // Format datepicker
        $("#endDateEdit").datepicker({
            firstDay: 1,
            dayNamesMin: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre"
                , "Noviembre", "Diciembre"],
            onSelect: function (selected, evnt) {
                $("#endDateEdit").val(getDateFormated(selected));
            }
        });
        getEventsFromServer();
    })

    getDateFormated = function (selected) {
        var daysOfWeek = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
        var monthsOfYear = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

        selected = new Date(selected);
        return daysOfWeek[selected.getDay()] + " " + monthsOfYear[selected.getMonth()] + " " + selected.getDate() +
            " " + selected.getFullYear();
    }

    // Function to get all events from server
    getEventsFromServer = function () {
        var url = "http://socialcalendarplus.esy.es/eventGet.php";

        $.getJSON(url, function (eventsReceived) {
            calendar.eventsCalendar.length = 0;
            $.each(eventsReceived, function (i, event) {
                calendar.eventsCalendar.splice(0, 0, {
                    "summary": event.name, "begin": new Date(event.start),
                    "end": new Date(event.finish), "id": event.id, "isPrivate": event.isPrivate
                });
            });
            calendar.refreshFunction();
        });
    }

    // Function to create an event
    addEventToCalendar = function () {
        name = document.getElementById("nameEvent").value;
        document.getElementById("nameEvent").value = "";
        if (name == "") {
            name = "Ocupado";
        }
        startDate = document.getElementById("startDate").value;
        startHour = document.getElementById("startHour").value;
        document.getElementById("startHour").value = "00:00";  // Reset
        if (startHour == "") {
            startHour = "00:00";
        }
        endDate = document.getElementById("endDate").value;
        endHour = document.getElementById("endHour").value;
        document.getElementById("endHour").value = "23:59";    // Reset
        if (endHour == "") {
            endHour = "00:01";
        }
        eventPrivate = document.getElementById("eventPrivate").checked;
        document.getElementById("eventPrivate").checked = 0;

        var dataToSend = [{
            "name": name,
            "start": new Date(startDate + " " + startHour),
            "finish": new Date(endDate + " " + endHour),
            "private": eventPrivate
        }]
        var dataJSON = JSON.stringify(dataToSend);
        var url = "http://socialcalendarplus.esy.es/eventSet.php";
       
       contactServer(url, dataJSON);

        $("#popupAddEvent").popup("close");
    }

    // Function to select an event
    selectEvent = function (id) {
        // Search event in calendar
        for (var i = 0; i < calendar.eventsCalendar.length; i++) {
            if (id == calendar.eventsCalendar[i].id) {
                calendar.eventSelected = calendar.eventsCalendar[i];    // Get event
                i = calendar.eventsCalendar.length;                     // Finish loop
            }
        }

        // Date
        var startDate = new Date(calendar.eventSelected.begin);
        var endDate = new Date(calendar.eventSelected.end);
        document.getElementById("nameEventEdit").value = calendar.eventSelected.summary;
        document.getElementById("startDateEdit").value = getDateFormated(startDate);
        document.getElementById("endDateEdit").value = getDateFormated(endDate);
        
        // Hour
        hour = startDate.toString().substr(16, 2);
        minutes = startDate.toString().substr(19, 2);
        document.getElementById("startHourEdit").value = hour + ":" + minutes;
        hour = endDate.toString().substr(16, 2);
        minutes = endDate.toString().substr(19, 2);
        document.getElementById("endHourEdit").value = hour + ":" + minutes;
        
        // Private
        if (calendar.eventSelected.isPrivate > 0) { // 0 = false
            document.getElementById("eventPrivateEdit").checked = true;
        } else {
            document.getElementById("eventPrivateEdit").checked = false;
        }
    }

    // Function to edit an event
    editEvent = function () {
        name = document.getElementById("nameEventEdit").value;
        if (name == "") {
            name = "Ocupado";
        }
        startDate = document.getElementById("startDateEdit").value;
        startHour = document.getElementById("startHourEdit").value;
        if (startHour == "") {
            startHour = "00:00";
        }
        endDate = document.getElementById("endDateEdit").value;
        endHour = document.getElementById("endHourEdit").value;
        if (endHour == "") {
            endHour = "00:01";
        }
        eventPrivate = document.getElementById("eventPrivateEdit").checked;

        var dataToUpdate = [{
            "id": calendar.eventSelected.id,
            "name": name,
            "start": new Date(startDate + " " + startHour),
            "finish": new Date(endDate + " " + endHour),
            "private": eventPrivate
        }]

        var dataJSON = JSON.stringify(dataToUpdate);
        var url = "http://socialcalendarplus.esy.es/eventUpdate.php";
        
        contactServer(url, dataJSON);

        $("#popupMenuEvent").popup("close");
    }

    // Function to delete an event
    deleteEvent = function () {
        var dataToDelete = [{
            "id": calendar.eventSelected.id
        }]
        var dataJSON = JSON.stringify(dataToDelete);
        var url = "http://socialcalendarplus.esy.es/eventDelete.php";
        
        contactServer(url, dataJSON);
        
        $("#popupMenuEvent").popup("close");    // Close popup
    }

    // Function to communicate with the server
    contactServer = function (url, data) {
        $.post(url, { eventData: data },
            function () {
                getEventsFromServer();
            }).error(
            function () {
                console.log('Error al ejecutar la petición');
            }
            );
    }
    /* ------------------------------------------------------------------------------*/

})(jQuery);
