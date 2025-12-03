const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const {name, email, password, confirmPassword, phone} = req.body;
    try {
        const existingUser= await User.findOne({email});
        if(existingUser){
            return  res.status(400).json({msg: "User already exists"});
        }   

        if(password !== confirmPassword){
            return res.status(400).json({msg: "Passwords do not match"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            phone
        });
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        await user.save();
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
            token
        });
    }
    catch(e){
        console.error(e.message);
        res.status(500).send("Server error");
    }
};

exports.login = async (req, res) => {
    const {email, password} = req.body;
    try {
        let user = await User.findOne({
            email
        });
        if(!user){
            return res.status(400).json({msg: "Invalid Credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg: "Invalid Credentials"});
        }
        const token = jwt.sign(
            {   id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.json({ token });

    }

    catch(e){
        console.error(e.message);
        res.status(500).send("Server error");
    }
};