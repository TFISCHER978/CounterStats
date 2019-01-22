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
            })
            }); // parses response to JSON

    $('#login').on('keyup', '.form-control', function(evt){
        if(evt.keyCode === 13) $('#login-submit').trigger('click');
    });

});