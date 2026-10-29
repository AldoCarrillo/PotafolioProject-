var noteData = require("../data/noteData");

const fs = require("fs");
const util = require("util");
const { json } = require("express");
const writeFileAsync = util.promisify(fs.writeFile);

module.exports = function (app) {
  app.get("/api/notes", function (req, res) {
    res.json(noteData);
  });

  app.post("/api/notes", function (req, res) {
    noteData.push(req.body);
    res.json(true);

    console.log("***Note saved: ", req.body);

    writeFileAsync("./db/db.json", JSON.stringify(noteData));
    console.log("***json created***");
  });

  app.delete("/api/notes/:index", function (req, res) {
    console.log("**Note deleted**");
    noteData.splice(req.params.index, 1);
    reorder();
    res.json(true);
  });

  function reorder() {
    for (let index = 0; index < noteData.length; index++) {
      noteData[index].id = index;
    }
  }
};
