import bcrypt from "bcryptjs";

module.exports = {
	post_login: function(req, res, pg){
		const query = {
			text: 'SELECT * FROM public.users WHERE pseudo=$1',
			values: [req.body.pseudo],
		};
		pg.connect();
		pg.query(query, (err, p_res) => {
			if(err) console.log("Error", err);
			else {
               var password = p_res.rows[0].password;
               var salt = password.split("\\.");

				if(!bcrypt.hashSync(req.body.password, salt)===password){
					req.body.html = null;
				} else {
					req.body.html = '<p>Bienvenue ' + req.body.pseudo + '</p>';
				}
				res.set("Content-Type", "application/json");
				console.log(req.body);
				res.send(req.body);
			}
		});
	}
}