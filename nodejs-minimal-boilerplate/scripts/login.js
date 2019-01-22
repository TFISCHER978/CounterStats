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
                console.log(response);
                if (response.status === 200) window.location.href = response.url;

                if (response.status === 401) {
                    window.location.href = response.url;
                    alert("Unauthorized\nIncorrect username or password.");
                }                
            })
        });

    $('#login').on('keyup', '.form-control', function(evt){
        if(evt.keyCode === 13) $('#login-submit').trigger('click');
    });

});