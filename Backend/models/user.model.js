const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

// 
userSchema.methods.isPasswordValid = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
}

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    }
})

userSchema.methods.generateToken = function () {
    const { _id, email } = this;
    console.log(this)
}

module.exports = model("Users", userSchema);