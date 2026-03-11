// import our libraries
const express = require("express");
const nunjucks = require("nunjucks");
// NEW LIBRARY
const cookieParser = require("cookie-parser");

// initialize our express application
let app = express();
// initialize our templating library
// connect nunjucks -> express
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
// connect express -> nunjucks
app.set("view engine", "njk");

//set up our middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// NEW MIDDLEWARE
app.use(cookieParser());

// routes come after middleware, but before the listen
app.get("/", (request, response) => {
  if (request.cookies.visits) {
    console.log(request.cookies.visits);
    let visits = request.cookies.visits;
    visits++;
    response.cookie("visits", visits, {
      expires: new Date(Date.now() + 1000 * 60 * 60),
    });
  } else {
    // 3 parameters:
    // 1st: name of the cookie to be stored
    // 2nd: initial value you want to be stored
    // 3rd: when the cookie expires, in object format
    let oneHourInMs = 1000 * 60 * 60;
    response.cookie("visits", 1, {
      expires: new Date(Date.now() + oneHourInMs),
    });
  }
  response.render("index.njk", { numVisits: request.cookies.visits });
});

app.get("/about", (request, response) => {
  response.render("about.njk");
});

// last!
app.listen(7001, () => {
  console.log("http://localhost:7001");
});
