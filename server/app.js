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

mongoose.connect('mongodb+srv://admin1:pass@cluster0-jai9z.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

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
        UserObject.updateOne({username: req.body.username}, req.body, {upsert: true}, function(err) {
            res.redirect("/dashboard");
        });
    });
});

app.get("/login", (req, res) => res.render("login"));
app.get('/', (req, res) => res.render("index"));

app.get("/dashboard", (req, res) => {
    if (req.session && req.session.isLoggedIn()) {
        UserObject.findOne({username: req.session.username}, function(err, obj) {
            res.render("index", {"courses": obj.course, "universities": obj.university});
        });
    } else {
        res.redirect("/login");
    }
});

app.get("/questions", (req, res) => {
    res.render("questionspage");
})

app.post("/feedback", (req, res) => {
    console.log("SESSION");
    console.log(req.session);
    let username = (req.session) ? req.session.username : null;

    let {subject1, subject2, subject3, subject4, grade1, grade2, grade3, grade4} = req.body;
    console.log(req.body);
    let subjects = [subject1, subject2, subject3];
    subjects.push((subject4 ? subject4 : "nothing"));
    subjects = JSON.stringify(subjects);

    let grades = [grade1, grade2, grade3];
    if (grade4) grades.push(grade4);
    grades = JSON.stringify(grades);

    console.log(subjects);
    console.log(grades);

    const { spawn } = require('child_process');
    const courseProcess = spawn('../recommendation/py_wrapper', ['../recommendation/course_recommendation.py', 'course.py', subjects]);

    courseProcess.stdout.on('data', async function(data) {
        recommendation = JSON.parse(data.toString());
        console.log(recommendation);
        let aUserObj = UserObject;
        await aUserObj.findOneAndUpdate({username: username}, {course: recommendation}, {"useFindAndModify":false});
    });

    const uniProcess = spawn('../recommendation/py_wrapper', ['../recommendation/uni_recommendation.py', 'uni.py', grades]);

    uniProcess.stdout.on('data', async (data) => {
        recommendation = JSON.parse(data.toString())
        console.log(recommendation);
        console.log("USERNAME IS :" + username);

        await UserObject.findOneAndUpdate({username: username}, {university: recommendation}, {"useFindAndModify":false});
    })
    res.redirect('/dashboard');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function absPath(relpath) { return path.join(__dirname + "/views/" + relpath); };