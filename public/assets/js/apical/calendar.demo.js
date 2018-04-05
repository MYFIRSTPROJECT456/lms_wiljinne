/*
Template Name: Color Admin - Responsive Admin Dashboard Template build with Twitter Bootstrap 3.3.7
Version: 2.1.0
Author: Sean Ngu
Website: http://www.seantheme.com/color-admin-v2.1/admin/html/
*/

var handleCalendarDemo = function() {
    
    var date = new Date();
    var currentYear = date.getFullYear();
    var currentMonth = date.getMonth() + 1;
        currentMonth = (currentMonth < 10) ? '0' + currentMonth : currentMonth;
    
    var calender = $('#calendar').fullCalendar({
        header: {
            left: 'month,agendaWeek,agendaDay',
            center: 'title',
            right: 'prev,today,next '
        },
        droppable: false, // this allows things to be dropped onto the calendar
        drop: function() {
            $(this).remove();
        },
        selectable: false,
        selectHelper: false,
        height:400,
        editable: false,
        eventLimit: false,
        events: function(start, end, timezone, callback) {
        jQuery.ajax({
            url: '/events',
            type: 'GET',
            dataType: 'json',
            success: function(doc) {
            var jsonevents =    JSON.parse(JSON.stringify(doc));
            // alert(JSON.stringify(doc));
                var events = [];
                    $.map( jsonevents["my"], function( r ) {

                        events.push({
                            id: "1",
                            title: "Calls : "+r.title,
                            start: r.start
                        });
                    });
                     $.map( jsonevents["other"], function( r ) {
                        events.push({
                             id: "2",
                            title: "Others : "+r.title,
                            start: r.start
                        });
                    });
            
                callback(events);
            }
        });
    },
 eventAfterRender: function(event, element, view) {
                      $(element).css('width','70px');
                    }        
        ,
        eventClick: function(calEvent, jsEvent, view) {
        
        var date = calEvent.start.format();
        var type = calEvent.id;
        var form = $(document.createElement('form'));
        $(form).attr("action", "/calllist");
        $(form).attr("method", "POST");

        var input = $("<input>")
        .attr("type", "hidden")
        .attr("name", "calldate")
        .val(date);

        var input1 = $("<input>")
        .attr("type", "hidden")
        .attr("name", "type")
        .val(type);

        $(form).append($(input));
          $(form).append($(input1));
        form.appendTo( document.body )
        $(form).submit();
    }
    });
};

var Calendar = function () {
	"use strict";
    return {
        //main function
        init: function () {
/*$.ajax({
  url: "/events",
  success: function(mdata){
    var data=JSON.parse(JSON.stringify(mdata));
             
  }
});*/     
handleCalendarDemo();        
        }
    };
}();