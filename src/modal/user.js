const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("../modal/task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Provide a valid email");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age cant be less than 0");
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      // minlength: 6,
      validate(value) {
        if (value.includes("password")) {
          throw new Error("Password cant be password");
        } else if (value.length < 6) {
          throw new Error("password length must be at least 6");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("userTasks", {
  ref: "Tasks",
  localField: "_id",
  foreignField: "createdBy",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar

  return userObject;
};

// This generate a new token for a user
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id.toString() },
    "thisisanewcourse"
  );
  user.tokens = user.tokens.concat({ token });
  user.save();
  return token;
};

// Creating a custom method findByCredentials to find user by their email and password
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }
  return user;
};

// hashing the user plain text password
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//Delete user's tasks when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ createdBy: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
