const express = require("express");
const app = express();
const favicon = require("serve-favicon");
const port = process.env.PORT || 3000;

app.use(favicon(__dirname + "/views/spotify-logo.png"));
app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});