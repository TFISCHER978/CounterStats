import fs from "fs";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const databaseUrl = process.env.DATABASE_URL;  //Use this shit to acces DataBase

app.use("/static/", express.static(__dirname + "/../static/"));
app.use("/scripts/", express.static(__dirname + "/../scripts/"));
app.use("/mock/", express.static(__dirname + "/../mock/"));
app.use("/server/", express.static(__dirname + "/../server/"));

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


app.get("/create_login", function(req, res) {
  const content = fs.readFileSync(`${__dirname}/../view/CreateLogin.html`);
  const token = req.headers.authorization;
  const origin = req.headers.origin;
  res.set("Content-Type", "text/html");
  res.send(content.toString());
});


app.post("/post-example", (req, res) => {
  console.log(req.body);
  res.set("Content-Type", "application/json");
  res.send(req.body);
});

module.exports = app;
