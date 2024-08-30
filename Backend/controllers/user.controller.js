const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

class Auth {
    async signup(req, res) {
        const { name, email, password } = req.body;
        let user = null;
        if (name && email && password) {
            await User.deleteMany();
            user = await User.create({ name, email, password })
        } else {
            return res.status(400).json({
                success: false,
                msg: "provided username, password and email fields."
            })
        }
        return res.status(200).json({
            success: true,
            data: {
                username: user.name,
                email: user.email
            }
        })
    }

    async login(req, res) {
        const { email, password } = req.body;
        if (!email) {
            throw new Error("provide email field.")
        }
        const user = await User.findOne({ email })
        if (!user) throw new Error("incorrect credentials.")
        const isPasswordValid = await user.isPasswordValid(password);
        if (!isPasswordValid) throw new Error("incorrect credentials.")
    }
}


module.exports = new Auth();