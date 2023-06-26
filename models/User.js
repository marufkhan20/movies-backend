const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    departmentName: String,
    profilePic: String,
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
