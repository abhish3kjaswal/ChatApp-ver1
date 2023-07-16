const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  phoneNo: {
    type: Number,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  token: {
    type: String,
  },
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
