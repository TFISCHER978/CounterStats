import app from "./app";
var port=process.env.PORT || 3000;
app.listen(port, function() {
  var databaseUrl = process.env.DATABASE_URL;
  console.log(`Database url: ${databaseUrl}`);
  console.log(`Server started on port ${port}!`);
});
