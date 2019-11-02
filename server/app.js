const express = require('express');
const mongoose = require("mongoose");
const easySession = require('easy-session'); // Require the module : line 1
const hbs = require("express-handlebars");
const app = express();
const port = 3000;

//mongoose.connect('mongodb+srv://admin1:pass@cluster0-jai9z.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

app.use(express.static('public'));
//app.use(express.cookieParser());
//app.use(express.session({secret: 'keyboard cat'}));
//app.use(easySession.main(express)); // Bind the module : line 2

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => res.sendFile("index.html"));

app.get("login", (req, res) => {
    // load Ilona's page
});

app.post("login", (req, res) => {
    // Better verification could be done
    //req.session.login(req.body).then(() => {
      //  res.redirect("/dashboard");
    //});
});

app.get("dashboard", (req, res) => {
    // check that the user exists in the database
    // if not, then redirect to login.
});

app.post("");


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
