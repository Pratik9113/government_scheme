const LoginModel = require("../models/login.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginController = async(req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({message: "Please fill all the fields"});
    }
    try {
        const user = await LoginModel.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid Credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.cookie("token", token, {
            httpOnly: true, secure: true, sameSite: 'none'
        });
        return res.status(200).json({data:user, token:token, message: "Login successful!", user });
    } catch (error) {
        console.log("Error : ",error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}


const signupController = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    // if (password !== confirmPassword) {
    //     return res.status(400).json({ message: "Passwords do not match" });
    // }
    try {
        const existingUser = await LoginModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new LoginModel({
            name,
            email,
            password: hashedPassword, 
        });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.cookie("token", token, {
            httpOnly: true, secure: true, sameSite: 'none'
        });

        return res.status(201).json({ 
            message: "Signup successful!", 
            data:newUser,
            token: token,
        });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
module.exports = { loginController, signupController };