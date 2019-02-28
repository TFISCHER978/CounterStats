$(document).ready(function() {
    $.getJSON( "/session", function( data ) {

        if (data.userName != null) {
            document.getElementById("linkLogin").href="myaccount";
            document.getElementById("linkCAccount").href="logout";
            document.getElementById("btnLogin").innerHTML="my account";
            document.getElementById("btnCAccount").innerHTML="logout";
        } else {
            document.getElementById("linkLogin").href="login";
            document.getElementById("linkCAccount").href="createaccount";
            document.getElementById("btnLogin").innerHTML="Sign in";
            document.getElementById("btnCAccount").innerHTML="Sign up";
        }
    });
});