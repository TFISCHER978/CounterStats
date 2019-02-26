$(document).ready(function() {

    var teamId = null;

    $.getJSON( "/session", function( data ) {
        $.each( data, function( key, val ) {
            if (key === "teamId") teamId = val;

            $("#" + key).text(key + " : " + val);
        });

        if (teamId == null) {
            $('#noTeam').css("visibility","visible");
        } else {
            $('#noTeam').css("visibility","hidden");
        }
    });

    function drawTable(data) {
        for (var i = 0; i < data.length; i++) {
            drawRow(data[i]);
        }
    }
    
    function drawRow(rowData) {
        var row = $("<tr />")
        $("#personDataTable").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
        row.append($("<td>" + rowData.pseudo + "</td>"));
        row.append($("<td>" + rowData.email + "</td>"));
    }


    $.getJSON('/teamInfo', function (data) {
        drawTable(data);
    });




});