const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;


// there needs to be an empty array 
let dataNotes = [];

// there needs to be some sort of middleware

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "Develop/public")));



app.get("/api/notes", function(req, res) {
    try {
      // reads the notes from json file
      dataNotes = fs.readFileSync("Develop/db/db.json", "utf8");
      console.log("hello!");
      // parse it so notesData is an array of objects
      dataNotes = JSON.parse(dataNotes);
  
      // error handling
    } catch (err) {
      console.log("\n error (in app.get.catch):");
      console.log(err);
    }
    //   send objects to the browser
    res.json(dataNotes);
  });

  app.post("/api/notes", function(req, res) {
    try {
      // reads the json file
      dataNotes = fs.readFileSync("./Develop/db/db.json", "utf8");
      console.log(dataNotes);
  
      // parse the data to get an array of objects
      dataNotes = JSON.parse(dataNotes);
      // Set new notes id
      req.body.id = dataNotes.length;
      // add the new note to the array of note objects
      dataNotes.push(req.body); // req.body - user input
      // make it string(stringify)so you can write it to the file
      dataNotes = JSON.stringify(dataNotes);
      // writes the new note to file
      fs.writeFile("./Develop/db/db.json", dataNotes, "utf8", function(err) {
        // error handling
        if (err) throw err;
      });
      // changeit back to an array of objects & send it back to the browser(client)
      res.json(JSON.parse(dataNotes));
  
      // error Handling
    } catch (err) {
      throw err;
      console.error(err);
    }
  });

      

  app.delete("/api/notes/:id", function(req, res) {
  try {
    //  reads the json file
    dataNotes = fs.readFileSync("./Develop/db/db.json", "utf8");
    // parse the data to get an array of the objects
    dataNotes = JSON.parse(dataNotes);
    // delete the old note from the array on note objects
    dataNotes = dataNotes.filter(function(note) {
      return note.id != req.params.id;
    });
    // make it string(stringify)so you can write it to the file
    dataNotes = JSON.stringify(dataNotes);
    // write the new notes to the file
    fs.writeFile("./Develop/db/db.json", dataNotes, "utf8", function(err) {
      // error handling
      if (err) throw err;
    });

    // change it back to an array of objects & send it back to the browser (client)
    res.send(JSON.parse(dataNotes));

    // error handling
  } catch (err) {
    throw err;
    console.log(err);
  }
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
  });
  

  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "Develop/public/index.html"));
  });
  
  app.get("/api/notes", function(req, res) {
    return res.sendFile(path.json(__dirname, "Develop/db/db.json"));
  });
  
  // Start the server on the port
  app.listen(PORT, function() {
    console.log("SERVER IS LISTENING: " + PORT);
  });