$(document).ready(function() {
    $('#submit').click( function () {
        var data = {
            name: $("#Name").val(),
            tag: $("#Tag").val()
        };
        fetch("/createteam", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
        .then(response => {
            if (response.status === 200) window.location.href = response.url;

            if (response.status === 402) {
                $("#error").css("visibility","visible");
                $("#pError").text("Name already used.");
            }     
        })
    });  

    $(document).bind('keypress', function(e) {
        if(e.keyCode==13){
             $('#submit').trigger('click');
         }
    });

    $('#Name, #Tag').on('keyup', function () {
        if ( !($('#Tag').val() === "") && !($('#Name').val() === "") && $("#Tag").val().length >3 && $("#Tag").val().length <11) {           
            $('#submit').prop('disabled', false);
        } else {
            $('#submit').prop('disabled', true);
        }
    });

    $('#Tag').on('keyup', function () {
        console.log($("#Tag").val().length);
        if ( $("#Tag").val().length >3 && $("#Tag").val().length <11) {
            if ($('#Tag').hasClass('is-invalid')) {
                $('#Tag').toggleClass('is-invalid');
            }
        } else {
            if (!$('#Tag').hasClass('is-invalid')) {
                $('#Tag').toggleClass('is-invalid');
            }
        }
    });

});