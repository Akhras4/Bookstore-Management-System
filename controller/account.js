const { model, Error } = require('mongoose');
const users = require("../models/user");
const userinfo = require("../models/userinfo");


const account=(req,res)=>{
    if ( req.method === "GET" ){
        const userid = req.params.id;
       users.findOne({_id:userid})
            .populate('books')
            .exec()
             .then(user=>{
                userinfo.findOne({user_id:userid})
                .then(userinfo=>{
                    if(!userinfo){
                       return res.status(200).render("account", {
                        userid,
                        username:user.UserName,
                        email:user.email,
                        phoneNumber:user.phoneNumber,
                        aboutyou:null,image:null,
                        books: user.books || null} ) 
                    }
                    res.status(200).render("account",
                     {userid,
                        username:user.UserName,
                        email:user.email,
                        phoneNumber:user.phoneNumber,
                        aboutyou:userinfo.aboutyou,
                        image:userinfo.image,
                        books: user.books || null

                    } )

                }).catch((err)=>{
                      res.status(200).render("account", {userid,username:user.UserName,email:user.email,phoneNumber:user.phoneNumber} )
                })
         }).catch(err=>{res.status(400).render("index", {userid} )})
    }  
if ( req.method == "POST" ){
        userid=req.params.id
        console.log(req.params)
        const  {about}=req.body
        console.log(req.body)
        users.findOne({_id:userid})
        .then(user=>{
            userinfo.findOneAndUpdate({ user_id: userid }, 
                                     { aboutyou: about },
                                     { upsert: true, new: true } )
                    .then(userinfo=>{
                         res.status(200).redirect(`/user/${userid}/account` )
                    }).catch(err=>{res.status(400).redirect(`/user/${userid}/account` )})
        }).catch(err=>{res.status(400).redirect(`/user/${userid}` )})
    }
}





module.exports = {
    account,    
}