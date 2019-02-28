import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";

require('dotenv').config();

const uuidv1 = require('uuid/v1');

const validator = require("email-validator");
const session = require('express-session');
const morgan = require('morgan');

const randomstring = require("randomstring");
const nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport'); 

const app = express();

const databaseUrl = process.env.DATABASE_URL;

app.use("/static/", express.static(__dirname + "/../static/"));
app.use("/scripts/", express.static(__dirname + "/../scripts/"));

// Json parsing
app.use(bodyParser.json());

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

const { Client } = require('pg')
const config = {
  connectionString: databaseUrl
};
const client = new Client(config);

client.connect()

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


app.get("/createaccount", function(req, res) {
  const content = fs.readFileSync(`${__dirname}/../view/CreateLogin.html`);
  res.set("Content-Type", "text/html");
  res.send(content.toString());
});

app.post("/createaccount",function(req, res) {
  const saltRounds = 10;

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
          text: 'INSERT INTO public.user VALUES ($1, $2, $3, $4, DEFAULT, null)',
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
          if (p_res.rows[i].email === req.session.userEmail) {
            var isyou = true;
          } else {
            var isyou = false;
          }

          teamJson.push({              
            pseudo: p_res.rows[i].pseudo,
            email: p_res.rows[i].email,
            isManager: p_res.rows[i].manager,
            you: isyou
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


app.get("/createteam", function(req, res) {

  if (req.session && req.session.userName && req.session.teamId == null) {
    const content = fs.readFileSync(`${__dirname}/../view/CreateTeam.html`);
    res.set("Content-Type", "text/html");
    res.send(content.toString());
  } else {
    res.redirect("/login");
  }
});

app.post("/createteam",function(req, res) {
  const saltRounds = 10;

  //Check mail not in base

  const query = {
    text: 'SELECT * FROM "public"."team" WHERE "T_name"=$1',
    values: [req.body.name],
  };
  client.query(query, (err, p_res) => {
    if(err) console.log("Error", err);
    else {
      if (p_res.rowCount == 0) {
        // console.log("Team not in base");
        const teamId = uuidv1();
        const query = {
          text: 'INSERT INTO "public"."team" VALUES ($1, $2, $3)',
          values: [teamId, req.body.name, req.body.tag]
        };
        client.query(query, (err, p_res) => {
          if(err) console.log("Error", err);
          else {

            // Recup in base data => session
            const query2 = {
              text: 'UPDATE "public"."user" SET "team_id" = (SELECT "T_id" from "public"."team" Where "T_name"=$1), "manager" = true WHERE "id" = $2',
              values: [req.body.name, req.session.userId]
            };
            client.query(query2, (err, p_res) => {
              if(err) console.log("Error", err);
              else {
                req.session.teamId=teamId;
                res.status(200);
                res.redirect("/team");
              }
            });
          }
        });

      } else {
        //Team in base
        res.status(401);
        res.send();
      }
    }
  });
});


app.post("/joinTeam", function(req,res) {

  //join team
  // => check code in base and note used
  // => do somethings

  const query = {
    text: 'SELECT * FROM public.invitcode WHERE code=$1',
    values: [req.body.code],
  };
  client.query(query, (err, p_res) => {
    if(err) console.log("Error", err);
    else {
      if (p_res.rowCount == 1 && p_res.rows[0].valid === true) {

        // update team member
        const query = {
          text: 'UPDATE "public"."user" SET "team_id" = (SELECT "team_id" FROM "public"."invitcode" where code = $1) WHERE "id" = $2',
          values: [req.body.code, req.session.userId]
        };
        client.query(query, (err, p_res) => {
          if(err) console.log("Error", err);
          else {
            
            // invalidate invite code
            const query = {
              text: 'UPDATE "public"."invitcode" SET "valid" = false WHERE "code" LIKE $1',
              values: [req.body.code]
            };
            client.query(query, (err, p_res) => {
              if(err) console.log("Error", err);
              else {}
            });

            const query2 = {
              text: 'SELECT "team_id" FROM "public"."user" WHERE "id"=$1',
              values: [req.session.userId]
            };
            client.query(query2, (err, p_res) => {
              if(err) console.log("Error", err);
              else {
                if (p_res.rowCount == 1) {
                  req.session.teamId=p_res.rows[0].team_id;
                  req.session.save( function(err) {
                    // req.session.reload( function (err) {
                    // });
                  });
                }
                
              }
            });


            res.status(200);
            res.redirect("/team")
          }
        });
      } else {
        //no code
        res.status(401);
        res.send();
      }
    }
  });
});


app.post("/addMember", function(req,res) {

  const query = {
    text: 'SELECT * FROM public.user WHERE email=$1',
    values: [req.body.email],
  };
  client.query(query, (err, p_res) => {
    if(err) console.log("Error", err);
    else {
      if (p_res.rowCount == 1) {

        var invitCode = randomstring.generate(20);

        const query = {
          text: 'INSERT INTO "public"."invitcode"  VALUES ($1, DEFAULT, $2)',
          values: [invitCode,req.session.teamId]
        };
        client.query(query, (err, p_res) => {
          if(err) console.log("Error", err);
          else {
            
            var transporter = nodemailer.createTransport(smtpTransport({
              service: 'gmail',
              auth: {
                user: process.env.MAIL,
                pass: process.env.PASSWORD
              },
              tls: {
                  rejectUnauthorized: false
              }
            }));
            
            var mailOptions = {
              from: process.env.MAIL,
              to: req.body.email,
              subject: 'Hey ! Join my team',
              text: 'Just use this code in your team page : \n' + invitCode + '\nBtw, here\'s the link :\n https://counterstat.herokuapp.com/'
            };
            
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            }); 

            res.status(200);
            res.send();
          }
        });
      } else {
        //mail not in base
        res.status(401);
        res.send();
      }
    }
  });
});


app.get("/newtraining", function(req, res) {
  if(req.session && req.session.teamId != null && req.session.manager){
    const content = fs.readFileSync(`${__dirname}/../view/Coach.html`);
    res.set("Content-Type", "text/html");
    res.send(content.toString());
  } else {
    res.redirect("/login");
  }
});


app.post('/newtraining', function(req,res) {

  if (req.session.manager) {

    var uuid = uuidv1();
    var date = req.body.date;
    var time = req.body.time;
    var fulldate = date + " " + time;

    const query = {
      text: 'INSERT INTO "public"."training" ("tr_id", "tr_date", "team_id", "tr_goal") VALUES ($1, $2, $3, $4)',
      values: [uuid,fulldate,req.session.teamId,req.body.goal]
    };
    client.query(query, (err, p_res) => {
      if(err) console.log("Error", err);
      else {
        res.status(200);
        res.redirect("/myaccount");
      }
    });

  } else {
    //mail not in base
    res.status(401);
    res.send();
  }
});

// get training based on user team_id
app.get("/traininginfo", function(req,res) {
  if(req.session && req.session.teamId != null){

    const query = {
      text: 'SELECT tr_date,tr_goal FROM "training" WHERE team_id=$1',
      values: [req.session.teamId],
    };
    client.query(query, (err, p_res) => {
      if(err) console.log("Error", err);
      else {
        res.setHeader('Content-Type', 'application/json');

        var teamJson = [];

        //JSONIFIER TOUT LES TRAINING

        for (var i = 0; i < p_res.rowCount; i++) {
          teamJson.push({
            goal: p_res.rows[i].tr_goal,
            time: p_res.rows[i].tr_date
          });      
        }
        res.status(200)
        res.end(JSON.stringify(teamJson, null, 3));
      }
    });
  }
  else{
    res.status(401)
    res.send('noTraining');
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
