import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
require('dotenv').config();
const uuidv1 = require('uuid/v1');

const app = express();
const databaseUrl = process.env.DATABASE_URL; 
app.use("/static/", express.static(__dirname + "/../static/"));
app.use("/scripts/", express.static(__dirname + "/../scripts/"));

// Json parsing
app.use(bodyParser.json());

app.get("/", function(req, res) {
  const content = fs.readFileSync(`${__dirname}/../view/index.html`);
  const token = req.headers.authorization;
  const origin = req.headers.origin;
  res.set("Content-Type", "text/html");
  res.send(content.toString());
});


app.get("/login", function(req, res) {
  const content = fs.readFileSync(`${__dirname}/../view/login.html`);
  const token = req.headers.authorization;
  const origin = req.headers.origin;
  res.set("Content-Type", "text/html");
  res.send(content.toString());
  
});

app.post("/login", function(req, res) {
  const { Client } = require('pg')
  const config = {
    connectionString: databaseUrl
  };
  const client = new Client(config);
  
  client.connect()
  const query = {
    text: 'SELECT * FROM public.user WHERE email=$1',
    values: [req.body.email],
  };
  client.query(query, (err, p_res) => {
    if(err) console.log("Error", err);
    else {
      var password = p_res.rows[0].password;
      var salt = password.split("\\.")[0];

      if(bcrypt.hashSync(req.body.password, salt)===password) {  // if password OK
        res.status(200);
        res.redirect("/");
      } else {                          // if password KO
        res.status(401);
        res.send();
      }
    }
  });
});


app.get("/create_account", function(req, res) {
  const content = fs.readFileSync(`${__dirname}/../view/CreateLogin.html`);
  const token = req.headers.authorization;
  const origin = req.headers.origin;
  res.set("Content-Type", "text/html");
  res.send(content.toString());
});


app.post("/create_account",function(req, res) {
  const { Client } = require('pg')
  const config = {
    connectionString: databaseUrl
  };
  const client = new Client(config);
  
  client.connect()
  const query = {
    text: 'INSERT INTO public.user VALUES ($1, $2, $3, $4, DEFAULT, null, null)',
    values: [req.body.email, uuidv1(), req.body.password, req.body.pseudo],
  };
  client.query(query, (err, p_res) => {
    if(err) console.log("Error", err);
    else {
      // var password = p_res.rows[0].password;
      // var salt = password.split("\\.")[0];

      // if(bcrypt.hashSync(req.body.password, salt)===password) {  // if password OK
      //   res.status(200);
      //   res.redirect("/");
      // } else {                          // if password KO
      //   res.status(401);
      //   res.send();
      // }
    }
  });
});


app.post("/post-example", (req, res) => {
  console.log(req.body);
  res.set("Content-Type", "application/json");
  res.send(req.body);
});

module.exports = app;
