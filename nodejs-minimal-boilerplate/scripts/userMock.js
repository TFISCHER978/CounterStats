//Connect to base using mock : user.json

function contains(arr, key, val) {
    for (var i = 0; i < arr.length; i++) {
        if(arr[i][key] === val) return true;
    }
    return false;
}

function getUser(arr,email) {
    for (var i = 0; i < arr.length; i++) {
        if(arr[i]["email"] === email) return i;
    }
    return null;
}

function login(){

    $.getJSON("../mock/user.json", function(json) {
        //console.log(json); // this will show the info it in firebug console

        email = document.getElementById("email").value;
        password = document.getElementById("password").value;

        if (contains(json,"email",email)) {
            user = json[getUser(email)];    //user infos
            if (user.password === password) {
                alert("Welcome " + user.pseudo + " !"); //infos OK : log in
            } else {
                alert("Email and password doesn't match");  //email OK, password KO : alert no log
            }
        } else {
            alert("Email : " + email + " doesn't exist");   //email KO
        }
    });
}