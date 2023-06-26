const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const path = require("path");

// check existing user by email
const checkUserByEmailController = async (req, res) => {
  try {
    const { email } = req.body || {};

    // check user already existing
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: {
          email: "Email is already exist, Please try to another email!",
        },
      });
    } else {
      res.status(200).json({ success: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error occurred" });
  }
};

// register controller
const registerController = async (req, res) => {
  const { firstName, lastName, email, password, departmentName, profilePic } =
    req.body;

  try {
    // upload book image
    let imagePath;

    if (profilePic) {
      console.log("profilePic", profilePic);
      // upload image
      const buffer = Buffer.from(
        profilePic?.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, ""),
        "base64"
      );

      imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

      try {
        const jimpResp = await Jimp.read(buffer);
        jimpResp.write(
          path.resolve(__dirname, `../public/storage/users/${imagePath}`)
        );
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          error: "Could not process the image!!",
        });
      }
    }

    // password hash
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        }

        // Create New User
        const newUser = new User({
          firstName,
          lastName,
          email,
          password: hash,
          departmentName: departmentName,
          profilePic: `/storage/users/${imagePath}`,
        });

        await newUser.save();

        if (newUser?._id) {
          res.status(201).json(newUser);
        }
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

// login controller
const loginController = async (req, res) => {
  const { email, password } = req.body;

  // check user available
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      error: {
        email: "User not found! Please try again!!",
      },
    });
  }

  // check password correct or incorrect
  bcrypt.compare(password, user.password, function (err, result) {
    if (err) {
      return res.status(500).json({
        error: "Server Error Occurred!",
      });
    }

    if (!result) {
      return res.status(400).json({
        error: {
          password: "Email or Password Incorrect!",
        },
      });
    }

    // prepare the user object to generate token
    const userObject = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePic: user?.profilePic,
      departmentName: user?.departmentName,
    };

    // generate token
    const token = jwt.sign(userObject, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    res.status(200).json({
      user: userObject,
      token,
    });
  });
};

module.exports = {
  checkUserByEmailController,
  registerController,
  loginController,
};
