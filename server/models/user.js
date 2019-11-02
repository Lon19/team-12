const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    username: String,
    password: String,
    grades: [String],
    subjects: [String],
    university: [String],
    course: [String],
    options: [[String]]
});

module.exports = mongoose.model("User", UserSchema);
