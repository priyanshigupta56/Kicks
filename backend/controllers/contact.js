const Contact = require("../models/contact");
const axios = require("axios");

exports.submitContactForm = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            subject, 
            message, 
            //captchaToken 
        } = req.body;

        // if (!captchaToken) {
        //     return res.status(400).json({ message: "Captcha is required" });
        // }

        // // Verify captcha with Google
        // const response = await axios.post(
        //     `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captchaToken}`
        // );

        // if (!response.data.success) {
        //     return res.status(400).json({ message: "Invalid Captcha" });
        // }

        // Save Contact entry
        const newContact = new Contact({ name, email, subject, message });
        await newContact.save();

        return res.status(201).json({
            message: "Contact form submitted successfully",
            data: newContact,
        });

    } catch (error) {
        console.error("Contact Form Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
