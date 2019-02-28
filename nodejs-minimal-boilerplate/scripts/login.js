$(document).ready(function() {
    $('#login-submit').click( function () {
        var data = {
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
                    $("#pError").text("Incorrect username or password.");
                }
                if (response.status === 402) {
                    $("#error").css("visibility","visible");
                    $("#pError").text("Email not known.");
                }     
            })
        });

        $(document).bind('keypress', function(e) {
            if(e.keyCode==13){
                 $('#login-submit').trigger('click');
             }
        });

    $('#password, #email').on('keyup', function () {
        if ( !($('#email').val() === "") && !($('#password').val() === "") ) {           
                $('#login-submit').prop('disabled', false);
        } else {
            $('#login-submit').prop('disabled', true);
        }
    });

});