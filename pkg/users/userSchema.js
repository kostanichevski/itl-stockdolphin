const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
  },
  email: {
    type: String,
    required: [true, "Email address required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  role: {
    type: String,
    enum: ["user", "admin", "administarot"], // enum se koristi koga imame tocno zadadeni parametri
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Passwod is required"],
    minlength: [4, "Password must be at least 8 characters long"],
    // validate: [validator.isStrongPassword, "Please provide a strong passowrd"], // validacija dali e silen pasvordot
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.Model("User", userSchema);

module.exports = User;
