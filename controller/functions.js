const { model, Error } = require('mongoose');
const users = require("../models/user");
const crypto=require("crypto")
const bcrypt=require("bcrypt");
require('dotenv').config();
const nodemailer = require("nodemailer");
const PORT = process.env.PORT ;
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
                    NewUser.updateOne(Password)
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

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}



const login = (req,res)=>{
    if(req.method==="GET"){ 
        res.render("login")
    }else if(req.method==="POST"){
       const{email,Password}=req.body;
       users.findOne({email})
            .then((discover)=>{
               console.log(discover)
               if( Password == discover.Password){
                   res.status(200).redirect(302,`/${discover.UserName}`,{discover})//302 for now Moved Temporarily
               }else{
                   res.status(400).json({message:"Username or password uncorrect"})//.render("login")
               }})
            .catch(error=>{
                console.error(error); 
                 res.status(500).json({error:"Internal Server Error"});
            })
    }
}

module.exports = {
    singup,
    tokenval,
    login,
    
   
}