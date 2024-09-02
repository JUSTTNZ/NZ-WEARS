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
    userPassword = String(userPassword);
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
    //the generated token should become invalid after 7 days.
    const token = jwt.sign({ id: _id, email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
}

module.exports = model("User", userSchema);