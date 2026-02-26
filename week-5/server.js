// 1. IMPORT LIBRARIES
// imports the express library
const express = require("express");
// imports our database library
let nedb = require("@seald-io/nedb");
// import our templating library
let nunjucks = require("nunjucks");

// 2. INITIALIZE LIBRARY SETTINGS
let app = express(); // sets up our express application

// sets up our database variable that we are storing data in an external file
let database = new nedb({ filename: "data.db", autoload: true });

// setting up nunjucks template
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
// express will use the templating engine of nunjucks
app.set("view engine", "njk");

// 3. MIDDLEWARE: SETTINGS FOR OUR APPLICATION
app.use(express.static("assets"));
app.use(express.urlencoded({ extended: true }));

// 4. ROUTES
app.get("/", (request, response) => {
  // any database manipulation needs to happen before sending the response
  database.insert({ data: "hello" });
  // inside of a request, this always needs to go at the end
  response.send("<h1>hi</h1>");
});

app.get("/data", (request, response) => {
  // first param: object we are looking for
  // second param: callback function, action to happen once I find that data
  let query = {};
  database.find(query, (error, foundData) => {
    // checking for an error
    if (error) {
      // if error found, send error response
      response.send("error");
    } else {
      // send back the found data in json format
      // format my found data in json
      let formattedJSON = {
        allData: foundData,
      };
      response.json(formattedJSON);
    }
  });
});

app.get("/guestbook", (request, response) => {
  // use the render function to convert any special .njk data into our client html
  // the second param is an object that represent the data that is going to be populated on the client-side
  // serverData is the name of the variable i am going to use
  response.render("guestbook.njk", { serverData: "<h1>hello</h1>" });
});

app.post("/sign", (request, response) => {
  // processing the body of my request in the format I want it to be displayed as json data
  // this is also how it would be stored in my database
  let guestSignature = {
    guestName: request.body.guest,
    guestMessage: request.body.guestMessage,
  };

  // storing the data in the database
  database.insert(guestSignature);

  // send the user back to the guestbook
  response.redirect("/guestbook");
});

app.get("/display-guest-messages", (request, response) => {
  let query = {
    guestName: { $exists: true },
  };
  database.find(query, (error, foundData) => {
    if (error) {
      response.redirect("/guestbook");
    } else {
      // response.json(foundData);
      response.render("messages.njk", { messages: foundData });
    }
  });
});

// LAST: START OUR SERVER
app.listen(9001, () => {
  console.log("server is now running");
});
