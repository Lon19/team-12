const express = require('express');
const mongoose = require("mongoose");
const app = express();
const port = 3000;

//mongoose.connect('mongodb+srv://admin1:pass@cluster0-jai9z.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile("index.html"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
