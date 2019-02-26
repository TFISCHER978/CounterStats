$(document).ready(function() {

    $.getJSON( "/session", function( data ) {
        var items = [];
        $.each( data, function( key, val ) {
            $("#" + key).text(key + " : " + val);
        });
    });


});