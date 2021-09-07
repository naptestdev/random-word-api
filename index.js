const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv/config");

const words = require("./words");

app.use(cors({ origin: true }));

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/word", (req, res) => {
  try {
    let filtered = words.filter((word) => {
      let valid = true;
      if (Number(req.query.min) > 0 && Math.round(Number(req.query.min)) > word.length) valid = false;
      if (Number(req.query.max) > 0 && Math.round(Number(req.query.max)) < word.length) valid = false;
      return valid;
    });
    if (filtered.length === 0) return res.sendStatus(400);
    res.send(randomChoice(filtered));
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/words", (req, res) => {
  try {
    if (!Number(req.query.num)) return res.redirect("/word");
    let filtered = words.filter((word) => {
      let valid = true;
      if (Number(req.query.min) > 0 && Math.round(Number(req.query.min)) > word.length) valid = false;
      if (Number(req.query.max) > 0 && Math.round(Number(req.query.max)) < word.length) valid = false;
      return valid;
    });
    if (filtered.length === 0) return res.sendStatus(400);
    res.send(filtered.sort(() => 0.5 - Math.random()).slice(0, Number(req.query.num)));
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/all", (req, res) => {
  if (Number(req.query.dl)) {
    let data = JSON.stringify(words);
    res.setHeader("Content-disposition", "attachment; filename= words.json");
    res.setHeader("Content-type", "application/json");
    res.send(data);
  } else {
    res.send(words);
  }
});

app.use((req, res) => res.redirect("/"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
