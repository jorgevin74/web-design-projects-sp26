const express = require("express");
const multer = require("multer");
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");
const nedb = require("@seald-io/nedb");

// setting up our application to use express
const app = express();
const database = new nedb({ filename: "data.db", autoload: true });
// set up our multer where our files will be stored
const uploadProcessor = multer({ dest: "static/uploads" });

// use nunjucks inside of our response.render function
nunjucks.configure("views", {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");
// configured our app to use the /static folder
app.use(express.static("static"));
// configure the app to be able to parse the body of requests
app.use(express.urlencoded({ extended: true }));

// for every location / page we want to access, we need a new route
app.get("/", (request, response) => {
  // if we want to get everything inside the database, we use empty object
  let query = {};
  database.find(query, (err, foundData) => {
    response.render("index.njk", { dataToBeSent: foundData });
  });
});

app.get("/make-a-post", (request, response) => {
  response.render("make-post.njk");
});

app.get("/post/:uniquepost", (request, response) => {
  let query = {
    _id: request.params.uniquepost,
  };
  database.findOne(query, (err, foundData) => {
    console.log(foundData);
    response.render("unique.njk", { dataToBeSent: foundData });
  });
});

app.post(
  "/post",
  uploadProcessor.single("uploadedImage"),
  (request, response) => {
    console.log(request.body);
    console.log(request.file);

    let dataToBeStored = {
      dataCaption: request.body.caption,
      filepath: "/uploads/" + request.file.filename,
      timestamp: Date.now(),
      date: new Date(Date.now()).toLocaleString(),
    };

    console.log(dataToBeStored);

    database.insert(dataToBeStored);

    response.redirect("/make-a-post");
  },
);

app.listen(9001, () => {
  console.log("server has started on port 9001");
});
