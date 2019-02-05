$(document).ready(function() {
    $('#submit').click( function () {
        var data = {
            pseudo: $("#pseudo").val(),
            email: $("#email").val(),
            password: $("#password").val()
        };
        fetch("/login", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
            .then(response => {
                if (response.status === 200) window.location.href = response.url;

                if (response.status === 401) {
                    $("#error").css("visibility","visible");
                }
            })
        });

    $('#login').on('keyup', '.form-control', function(evt){
        if(evt.keyCode === 13) $('#login-submit').trigger('click');
    });


    $('#password, #confirm_password').on('keyup', function () {
        if ($('#password').val() == $('#confirm_password').val()) {
          $('#message').html('Matching').css('color', 'green');

        } else 
          $('#message').html('Not Matching').css('color', 'red');

      });

});

