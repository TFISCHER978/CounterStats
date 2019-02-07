$(document).ready(function() {
    $('#submit').click( function () {
        var data = {
            pseudo: $("#pseudo").val(),
            email: $("#email").val(),
            password: $("#password").val()
        };
        fetch("/create_account", {
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
                    $("#pError").text("Email already used.");
                }
            })
        });

    $('#login').on('keyup', '.form-control', function(evt){
        if(evt.keyCode === 13) $('#login-submit').trigger('click');
    });


    $('#password, #confirm_password').on('keyup', function () {
        if ($('#password').val() == $('#confirm_password').val()) {
            if ($('#confirm_password').hasClass('is-invalid')) {
                $('#confirm_password').toggleClass('is-invalid');
                $('#password').toggleClass('is-invalid');
            }
        } else {
            if (!$('#confirm_password').hasClass('is-invalid')) {
                $('#confirm_password').toggleClass('is-invalid');
                $('#password').toggleClass('is-invalid');
            }
        }
      });

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

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

