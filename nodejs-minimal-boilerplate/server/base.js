const { Client } = require('pg');

const client = new Client({
  connectionString: "postgres://lmscmgzylnaoby:412c5c243954b8aef11a413a517327d36a2208d6b0b771f265346ccd137c814e@ec2-54-217-237-93.eu-west-1.compute.amazonaws.com:5432/d4b9t0on0gjt0h",
  ssl: true,
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});
