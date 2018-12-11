var email = "-";
var motdepasse = "-";

function identification() {
	var foundUser = {
		"email":"foo.bar",
		"password":""
	};

	return foundUser!=null&&foundUser.password==bcrypt(password);
	
}

/*permet de recuperer les valeurs du mail et du mot de passe entrees lors du login*/
function recuperer_info_login(){
	email = document.getElementById("emailAddress").value;
	motdepasse = document.getElementById("motdepasse").value;
}

function affichelogin(){
	var mail = email;
	var mdp = motdepasse;
	document.getElementById("res").innerHTML ="mail : "+email+" - mdp : "+mdp+" ";
}