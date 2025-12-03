const mongoose = require("mongoose");

const db = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
    }catch(e){
        console.error(e.message);
        process.exit(1);
    }
};
module.exports = db;