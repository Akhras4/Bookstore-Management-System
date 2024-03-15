const { model, Error } = require('mongoose');
const users = require("../models/user");
const crypto=require("crypto")



const singup = (req, res) => {
    if (req.method === "GET") {
        res.render("signup")
    } else if (req.method === "POST") {
        const { UserName, Password, email, phoneNumber, IPAddress } = req.body
        let usercheck = users.findOne({ email })
        if (usercheck ) {
            let emailtoken = crypto.randomBytes(64).toString("hex")
            const NewUser = new users(UserName, Password, email, phoneNumber, IPAddress, emailtoken)
            NewUser.save()
                .then(() => {
                    res.status(200).json({ _id: NewUser._id, UserName, email, emailtoken });
                })
                .catch((error) => {
                    if (error.name === 'ValidationError') {
                        const errors = Object.values(error.errors).map(error => error.message);
                        res.status(400).json({ errors });
                    } else {
                        res.status(500).send("Error saving user")
                    }
                })
            } else {
                    return res.status(400).json("the email has already regested")
        }
    }
}
const tokenval = (req, res) => {
    const emailtoken = req.body.emailtoken;
    if (!emailtoken) return res.status(404).json("Token not found");
    users.findOne({ emailtoken })
         .then(NewUser => {
            if (NewUser) {
                NewUser.isValidate = true;
                NewUser.emailtoken = null;
                return NewUser.save();
            } else {
                throw new Error("Invalid token");
            }
        })
        .then(newUser => {
            res.status(200).json({ UserName: newUser.UserName, Password: newUser.Password, emailtoken: newUser.emailtoken, isValidate: newUser.isValidate });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json(error.message);
        });
};


module.exports = {
    singup,
    tokenval
}