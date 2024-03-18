const { model, Error } = require('mongoose');
const users = require("../models/user");
const crypto=require("crypto")
const bcrypt=require("bcrypt");
require('dotenv').config();
const nodemailer = require("nodemailer");
const { brotliCompressSync } = require('zlib');
const PORT = process.env.PORT ;
const jwt = require('jsonwebtoken');


const singup = (req, res) => {
    if (req.method === "GET") {
        res.render("signup")
    } else if (req.method === "POST") {
        console.log(req.body)
        const { UserName, Password, email, phoneNumber, IPAddress } =req.body
        console.log(req.body)
        users.findOne({ email })
        .then((usercheck)=>{ if ( usercheck ){
             return res.status(400).json("the email has already regested")
            }else{
            let emailtoken = crypto.randomBytes(64).toString("hex")
            const NewUser = new users({UserName, Password, email, phoneNumber, IPAddress, emailtoken})
            NewUser.save()
                   .then(() => {
                    const hash = bcrypt.hashSync(Password , 15)
                    NewUser.Password=hash
                    NewUser.save({ new:true })
                           .then(()=>{sendemailtoclient(email,UserName,emailtoken,PORT) })
                           .then(()=> {res.status(200).json({ _id: NewUser._id, UserName, email, emailtoken })})
                           .catch((error)=>{res.status(400).json(error="faild hash")})
                   })
                   .catch((error) => {
                      if (error.name === 'ValidationError') {
                      let errors = {};
                      Object.keys(error.errors).forEach((key) => {
                      errors[key] = error.errors[key].message;
                      });
                        res.status(400).json( errors );
                      } else {
                         res.status(500).send("Error saving user")
                      }
                    })
            }
        })
    }
}


const tokenval = (req, res) => {
    const emailtoken = req.query.emailtoken;
    if (!emailtoken) return res.status(404).json("Token not found");
    users.findOneAndUpdate({ emailtoken }, { isValid: true, emailtoken: null },{ new:true }) 
        .then(newUser => {
            const payload = {
                userId: newUser._id,
                UserName: newUser.UserName
            };
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' }, (err, token) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: "Failed to generate token" });
                } else {
                    res.status(200).json({ token });
                }
            })
        })
        .catch(error => {
           return res.status(404).json("deed token");
        })
};


async function sendemailtoclient(email,UserName,emailtoken,PORT){
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.Appemail,
            pass: process.env.AppPassword, 
        },
    });

    try {
        const info = await transporter.sendMail({
            from: '"registration-system 👻" <aboakhras4@gmail.com>',
            to: email,
            subject: "Hello ✔",
            text: `Hello ${UserName}`,
            html: `<b>Hello ${UserName}</b> <a href="http://localhost:${PORT}/VerificationEmail?emailtoken=${emailtoken}">Verification Link</a>`
        });
        HoldingUntileRedirect(email)
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

 function HoldingUntileRedirect(email){
                setTimeout(() => {
                users.findOne({email}) 
                    .then((newuser)=>{
                        if (newuser.isValid === false) {
                             newuser.deleteOne({ email })
                                .then(() =>{
                                     console.log("User deleted successfully")
                                      return
                                    })
                                .catch((err) => console.error("Error deleting user:", err));
                    }}) 
              }, 150000);           
}


const login = (req,res)=>{
    if(req.method==="GET"){ 
        res.render("login")
    }else if(req.method==="POST"){
       const{email,Password}=req.body;
       users.findOne({email})
            .then((discover)=>{
               console.log(discover)
               bcrypt.compare(Password, discover.Password, (err, result) => {
                if(err){
                    res.status(400).json({message:"err"})//.render("login")
                }
                if (result){
                    const payload = {
                    userId: discover._id,
                    email: discover.email,
                    UserName: discover.UserName
                };
                console.log(discover)
                jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' }, (err, token) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: "Failed to generate token" });
                    } else {
                        res.status(200).json({ token });
                    }
                });
               }else{
                return res.status(400).json({success: false, message: 'passwords do not match'})
               }})
            })
            .catch(error=>{
                console.error(error); 
                 res.status(500).json({message:"Internal Server Error"});
            })
    }
};


const cookieJWTAuth=(req,res,next)=>{
    const token =req.cookies.token
    .then(()=>{
        const user=jwt.verify(token,process.env.MY_SECRET);
        req.user=user
        next()
    })
    .catch((err)=>{
        res.clearCookie("token")
        return res.redirect("/")
    })
}

module.exports = {
    singup,
    tokenval,
    login,
    cookieJWTAuth,
     
}