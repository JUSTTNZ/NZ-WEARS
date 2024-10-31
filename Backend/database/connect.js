const mongoose = require("mongoose");

const connectToDatabase = async (url) => {
    await mongoose.connect(url);
}

module.exports = connectToDatabase;