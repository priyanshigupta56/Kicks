const Contact = require("../models/contact");
const axios = require("axios");

exports.submitContactForm = async (req, res) => {
    try {
        const { 
            name, 
            email, 
            subject, 
            message, 
            
        } = req.body;

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
