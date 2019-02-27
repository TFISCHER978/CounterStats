import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";

require('dotenv').config();

const uuidv1 = require('uuid/v1');

const validator = require("email-validator");
const session = require('express-session');
const morgan = require('morgan');

const app = express();

const databaseUrl = process.env.DATABASE_URL;

app.use("/static/", express.static(__dirname + "/../static/"));
app.use("/scripts/", express.static(__dirname + "/../scripts/"));

// Json parsing
app.use(bodyParser.json());

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

app.use(require('express-session')({
  name: 'session', // The name of the cookie
  secret: process.env.SECRET, // The secret is required, and is used for signing cookies
  resave: false, // Force save of session for each request.
  saveUninitialized: false // Save a session that is new, but has not been modified
}));

app.get("/", function(req, res) {
  const content = fs.readFileSync(`${__dirname}/../view/index.html`);
  const token = req.headers.authorization;
  const origin = req.headers.origin;
  res.set("Content-Type", "text/html");
  res.send(content.toString());
});

// route for user login
app.get("/login", function(req, res) {
  const content = fs.readFileSync(`${__dirname}/../view/login.html`);
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
      if (p_res.rowCount == 1) {
        var password = p_res.rows[0].password;
        var salt = password.split("\\.")[0];

        if(bcrypt.hashSync(req.body.password, salt)===password) {  // if password OK
          res.status(200);

          // Set session
          req.session.userName=p_res.rows[0].pseudo;
          req.session.userEmail=p_res.rows[0].email;
          req.session.userId=p_res.rows[0].id;
          req.session.manager=p_res.rows[0].manager;
          req.session.teamId=p_res.rows[0].team_id;
          
          // console.log(req.session.userName)
          // console.log(req.session.userEmail)
          // console.log(req.session.userId)
          // console.log(req.session.manager)
          // console.log(req.session.teamId)

          //Todo : authenticate -> myaccount
          //Todo : myaccount -> show name, team id etc...

          res.redirect("/myaccount");
        } else {                          // if password KO
          res.status(401);
          res.send();
        }
      } else {
        res.status(402);
        res.send();
      }
    }
  });
});


app.get("/create_account", function(req, res) {
  const content = fs.readFileSync(`${__dirname}/../view/CreateLogin.html`);
  res.set("Content-Type", "text/html");
  res.send(content.toString());
});

app.post("/create_account",function(req, res) {
  const { Client } = require('pg')
  const config = {
    connectionString: databaseUrl
  };
  const client = new Client(config);
  const saltRounds = 10;
  
  client.connect()

  //Check mail not in base

  const query = {
    text: 'SELECT * FROM public.user WHERE email=$1',
    values: [req.body.email],
  };
  client.query(query, (err, p_res) => {
    if(err) console.log("Error", err);
    else {
      if (p_res.rowCount == 0) {
        // console.log("Email not in base");
        const query = {
          text: 'INSERT INTO public.user VALUES ($1, $2, $3, $4, DEFAULT, null, null)',
          values: [req.body.email, uuidv1(), bcrypt.hashSync(req.body.password, saltRounds), req.body.pseudo]
        };
        client.query(query, (err, p_res) => {
          if(err) console.log("Error", err);
          else {

            // Recup in base data => session
            const query2 = {
              text: 'SELECT * FROM public.user WHERE email=$1',
              values: [req.body.email]
            };
            client.query(query2, (err, p_res) => {
              if(err) console.log("Error", err);
              else {
                if (p_res.rowCount == 1) {
                  req.session.userName=p_res.rows[0].pseudo;
                  req.session.userEmail=p_res.rows[0].email;
                  req.session.userId=p_res.rows[0].id;
                  req.session.manager=p_res.rows[0].manager;
                  req.session.teamId=p_res.rows[0].team_id;     

                  res.status(200);
                  res.redirect("/myaccount");
                }
              }
            });
          }
        });

      } else {
        //Email in base
        res.status(402);
        res.send();
      }
    }
  });
});

app.get("/myaccount", function(req, res) {

  if (req.session && req.session.userName) {
    const content = fs.readFileSync(`${__dirname}/../view/MyAccount.html`);
    res.set("Content-Type", "text/html");
    res.send(content.toString());
  } else {
    res.redirect("/login");
  }
});

app.get("/team", function(req, res) {

  if (req.session && req.session.userName) {
    const content = fs.readFileSync(`${__dirname}/../view/team.html`);
    res.set("Content-Type", "text/html");
    res.send(content.toString());
  } else {
    res.redirect("/login");
  }
});

// get all session storage
app.get("/session", function(req,res) {
  if(req.session && req.session.userName){
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      userName: req.session.userName, 
      userEmail: req.session.userEmail, 
      userId: req.session.userId, 
      manager: req.session.manager, 
      teamId: req.session.teamId }, null, 3));
  }
  else{
    res.send('noUser');
  }
});

// get team member based on current session user
app.get("/teamInfo", function(req,res) {
  if(req.session && req.session.teamId != null){
    const { Client } = require('pg')
    const config = {
      connectionString: databaseUrl
    };
    const client = new Client(config);
    
    client.connect()
    const query = {
      text: 'SELECT pseudo,email,manager FROM "user" WHERE team_id=$1',
      values: [req.session.teamId],
    };
    client.query(query, (err, p_res) => {
      if(err) console.log("Error", err);
      else {
        res.setHeader('Content-Type', 'application/json');

        var teamJson = [];

        for (var i = 0; i < p_res.rowCount; i++) {
          teamJson.push({              
            pseudo: p_res.rows[i].pseudo,
            email: p_res.rows[i].email,
            isManager: p_res.rows[i].manager
          });      
        }
        res.end(JSON.stringify(teamJson, null, 3));
      }
    });
  }
  else{
    res.send('noTeam');
  }
});

// Logout
app.get('/logout', function(req, res, next) {
  if (req.session) {
    // regenerate session object
    req.session.regenerate(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

app.get('*', function(req, res){
  res.send('what???', 404);
});


module.exports = app;
