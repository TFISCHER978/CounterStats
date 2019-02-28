$(document).ready(function() {
    $('#submit').click( function () {
        var data = {
            goal: $("#goal").val(),
            date: $("#date").val(),
            time: $("#time").val()
        };
        fetch("/newtraining", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
        .then(response => {
            if (response.status === 200) window.location.href = response.url;

            if (response.status === 401) {
                alert("Seems like you're not team manager.")
            }
        })
    }); 

    $(document).bind('keypress', function(e) {
        if(e.keyCode==13){
             $('#submit').trigger('click');
         }
    });

    $('#password, #confirm_password, #pseudo, #email').on('keyup', function () {
        if ( !($('#pseudo').val() === "") && !($('#password').val() === "") && !($('#confirm_password').val() === "") ) {

            if ( validateEmail( $('#email').val() )) {              
                $('#submit').prop('disabled', false);
            } else {
                $('#submit').prop('disabled', true);
            }
        } else {
            $('#submit').prop('disabled', true);
        }
    });
});

