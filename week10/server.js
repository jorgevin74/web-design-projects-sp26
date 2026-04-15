// how do we know this is a npm project?
// A: because package.json exists

// what command do we run to start an npm project?
// A: npm init (we could also run npm init -y)

// how do we create the node_modules folder if it doesn't exist?
// A: npm install / npm i

// what does the below chunk of code do?
// A: the chunk of code below allows us to import and load the different modules that we installed right before starting our code
// so we would have to initialize and require that nunjucks, express, etc be declared so that the server recognizes them.
const express = require("express");
const multer = require("multer");
const nunjucks = require("nunjucks");
const nedb = require("@seald-io/nedb");

// what is app?
// A: app stores the application instance so if we ever wanted to add different routes or configure it any way we can do so
// creates our web server that uses express
const app = express();

// what is database?
// A: it creates an external file that stores information in object format (it is in curly braces)
const database = new nedb({ filename: "data.db", autoload: true });
// autoload: true allows for the files to load automatically when the server runs

// what is this configuring?
// A: creates a folder that allows for content to be stored such as images / videos.
const upload = multer({
  dest: "public/uploads",
});

// what do each of these statements do?
// write the answer next to the line of code
app.use(express.static("public")); // A: any front end files from our sites, and assets are available. It allows for express to expose those files
app.use(express.urlencoded({ extended: true })); // A: accepts any types of inputs and allows them to be uploaded to the server. Lets us use request.body and read all of the request data from the client
app.set("view engine", "njk"); // A: express is able to view and use and send njk files
nunjucks.configure("views", {
  autoescape: true,
  express: app,
}); // A: lets the views folder store all of the njk files and links it to the app.

// what type of request is this? what does it do?
// A: it is a GET request that lets the user go into the server (main page of the server) and sets what happens when the main route is hit
app.get("/", (request, response) => {
  // how many different responses can we write? list them.
  // A: 5 responses, render, send, json, redirect, sendFile
  // how many parameters does response.render use? list them.
  // A: 2 parameters, (usually 1 but 2 is optional, with the firtst being the render and then the 2nd is the object with data we're sending)
  // write out the render for index.njk using the database
  database.find({}, (err, foundData) => {
    response.render("index.njk", { serverData: foundData });
  });
});

// what are the three parameters in this function?
// A: route ("/upload"), upload.single, (req,res)=>()
app.post("/upload", upload.single("theimage"), (req, res) => {
  let currentDate = new Date();

  // what type of data structure is this?
  // A: it is an object (we know this because of the curly braces)
  let data = {
    dataCaption: req.body.text,
    date: currentDate.toLocaleString(),
    timestamp: currentDate.getTime(),
  };

  // why do we write this if statement?
  // A: to check if the file is already there
  if (req.file) {
    data.image = "/uploads/" + req.file.filename;
  }

  // what does the insert function do?
  // A: the insert function allows for the data from dataToBeStored inside of our own database
  database.insert(data);
  // a: array equivalent is arr.push()
  res.redirect("/");
});

// what does the number signify?
// A: the number is the port number that the server uses to run. so in this case the number 6001 is the port that our website / server is running on. In other instances that port can be a different number such as 3000 or 8080
// how do we access this on the web?
// A: you access the website by doing localhost:(insert the server port so in this case it would be 6001) so for the full link you would go into your web browser of choice and enter in (http://localhost:6001) and click enter and you'd be inside of your server/website
app.listen(6001, () => {
  console.log("server started on port 6001");
});

// continue answering the questions in the index.njk
