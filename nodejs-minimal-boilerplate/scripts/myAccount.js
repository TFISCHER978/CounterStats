$(document).ready(function() {
    var messages = ["We were expecting you ( ͡° ͜ʖ ͡°)", "We hope you brought pizza.", "Leave your weapons by the door."];

    $.getJSON( "/session", function( data ) {
        $.each( data, function( key, val ) {
            if (key === "teamId" && val != null) teamId = val;

            $("#" + key).text("Welcome " + val + " " + messages[Math.floor(Math.random() * messages.length)]);
        });

        if (teamId == null) {
            //no team
        } else {
            $.getJSON('/traininginfo', function (data) {
                if (data.length > 0) {
                    drawTable(data);
                } else {

                }
            });
        }
    });

    function drawTable(data) {
        var tbl = document.createElement('table');
        tbl.setAttribute("id", "trainingDataTable");
        tbl.setAttribute("class", "table table-bordered");
        document.getElementsByTagName('main')[0].appendChild(tbl);

        var thead = document.createElement('thead');
        thead.setAttribute("id", "trainingHead")
        document.getElementById('trainingDataTable').appendChild(thead)

        var tbody = document.createElement('tbody');
        tbody.setAttribute("id", "trainingBody")
        document.getElementById('trainingDataTable').appendChild(tbody)

        var row = "<tr id='tableHeader'><th scope='col'>#</th><th scope='col'>Goal</th><th scope='col'>Date</th></tr>";
        $("#trainingHead").append(row);

        for (var i = 0; i < data.length; i++) {
            drawRow(data[i], i);
        }
    }
    
    function drawRow(rowData, index) {
        var j = new Array( "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" );
        var m = new Array( "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

        var row = "<tr><th scope='row'>" + (index+1) + "</th><td>" + rowData.goal + "</td><td>" + j[new Date(rowData.time).getDay() - 1] + ", " + m[new Date(rowData.time).getMonth()] + " " + new Date(rowData.time).getFullYear() + " " + new Date(rowData.time).getHours() + ":" + new Date(rowData.time).getMinutes() + "</td></tr>";
        $("#trainingBody").append(row);

    }


});