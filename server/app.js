const express = require('express');
const mongoose = require("mongoose");
const session = require('express-session');
const easySession = require('easy-session'); // Require the module : line 1
const hbs = require("express-handlebars");
var cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

const path = require("path");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const UserObject = require("./models/user");

//mongoose.connect('mongodb+srv://admin1:pass@cluster0-jai9z.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

app.engine(
    "hbs",
    hbs({
        partialsDir: ["views/partials"],
        extname: ".hbs",
        layoutsDir: "views",
        defaultLayout: "layout"
    })
);
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, 'views')));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(easySession.main(session)); // Bind the module : line 2

app.post("/login", (req, res) => {
    req.session.login(req.body).then(() => {
        UserObject.updateOne({_id: req.body._id}, req.body, {upsert: true}, function(err) {
            res.redirect("/dashboard");
        });
    });
});

app.get("/login", (req, res) => res.render("login"));
app.get('/', (req, res) => res.render("index"));

app.get("/dashboard", (req, res) => {
    if (req.session && req.session.isLoggedIn()) {
        res.render("index");
    } else {
        res.redirect("/login");
    }
});

app.post("/feedback", (req, res) => {
    let {subject1, subject2, subject3, subject4, grade1, grade2, grade3, grade4} = req.body;
    let subjects = JSON.stringify([subject1, subject2, subject3, subject4]);
    let grades = JSON.stringify([grade1, grade2, grade3, grade4]);

    const { spawn } = require('child_process');
    const courseProcess = spawn('../recommendation/py_wrapper', ['../recommendation/course_recommendation.py', 'course.py', subjects]);

    courseProcess.stdout.on('data', function(data) {
        recommendation = JSON.parse(data.toString())
        console.log(recommendation)
    });

    const uniProcess = spawn('../recommendation/py_wrapper', ['../recommendation/uni_recommendation.py', 'uni.py', grades]);

    uniProcess.stdout.on('data', (data) => {
        recommendation = JSON.parse(data.toString())
        console.log(recommendation);
    })
    res.send('Hello')
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function absPath(relpath) { return path.join(__dirname + "/views/" + relpath); };