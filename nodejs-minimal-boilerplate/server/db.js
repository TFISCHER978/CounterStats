module.exports = {
	init: function() {
		const {Client} = require('pg')
		return new Client({
		  user: 'lmscmgzylnaoby',
		  host: 'ec2-54-217-237-93.eu-west-1.compute.amazonaws.com',
		  database: 'd4b9t0on0gjt0h',
		  password: '412c5c243954b8aef11a413a517327d36a2208d6b0b771f265346ccd137c814e',
		  port: 5432,
		});
	}
}