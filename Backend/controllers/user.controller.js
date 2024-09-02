const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

class AuthController {
    async register(req, res) {
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
            user: {
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
        const token = user.generateToken();
        const { email: userEmail, _id, date } = user;
        const resObj = {
            token,
            user: {
                id: _id,
                email: userEmail,
                date
            }
        }

        res.status(200).json({ success: true, ...resObj });
    }
}


module.exports = new AuthController();