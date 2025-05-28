
import validator from "validator";
import userModel from "../models/userModel.js";
import bcrypt, { genSalt } from "bcrypt";
import jwt from "jsonwebtoken";

//create jwt token
const createToken = (user_id) => {
  return jwt.sign({ user_id }, process.env.jwt_secret);
};

//Route for user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.json({ success: false, message: "User doesn't exist" });
    }
    //checking if passwords match
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      res.json({ success: true, token, message:"Successfully logged in" });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Route for user register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  //checking if user already exists

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User email already exists" });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "please provide a valid E-mail",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please provide a strong password",
      });
    }
    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//Route for admin login
const adminLogin = async (req, res) => {
  try {
    const {email,password} = req.body;
    console.log('hre');
    if(email === process.env.ADMIN_EMAIL) {
      if(password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign(email+password,process.env.jwt_secret);
        res.json({success:true,token});
        
      }
      else {
        res.json({success:false,message:"Invalid credentials"});
      }
    }else{
      res.json({success:false,message:"User does not exist"});
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin };
