const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    max: 255,
  },
  last_name: {
    type: String,
    required: true,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  age: {
    type: Number,
    required: true,
    max: 150,
    min: 10,
  },
  city: {
    type: String,
    required: true,
    max: 255,
  }

});

module.exports = mongoose.model("User", userSchema);
