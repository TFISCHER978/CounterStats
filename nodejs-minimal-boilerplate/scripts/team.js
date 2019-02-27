$(document).ready(function() {

    var teamId = null;

    $.getJSON( "/session", function( data ) {
        // $.each( data, function( key, val ) {
        //     if (key === "teamId" && val != null) teamId = val;

        //     $("#" + key).text(key + " : " + val);
        // });

        if (teamId == null) {
            $('.noTeam').css("visibility","visible");
        } else {
            $('.noTeam').css("visibility","hidden");
            $.getJSON('/teamInfo', function (data) {
                drawTable(data);
            });
        }
    });

    function drawTable(data) {
        var tbl = document.createElement('table');
        tbl.setAttribute("id", "personDataTable");
        document.getElementsByTagName('body')[0].appendChild(tbl);
        var row = "<tr id='tableHeader'><th>Rank</th><th>Pseudo</th><th>Email</th></tr>";
        $("#personDataTable").append(row);

        for (var i = 0; i < data.length; i++) {
            drawRow(data[i]);
        }
    }
    
    function drawRow(rowData) {
        var row;
       
        if (rowData.isManager) {
            row = "<tr id='manager'><td>Manager</td><td>" + rowData.pseudo + "</td><td>" + rowData.email + "</td></tr>";
            $("#tableHeader").after(row);
        } else {
            row = "<tr class='player'><td>Player</td><td>" + rowData.pseudo + "</td><td>" + rowData.email + "</td></tr>";
            $("#personDataTable").append(row); //this will append tr element to table... keep its reference for a while since we will add cels into it
        }
    }

});