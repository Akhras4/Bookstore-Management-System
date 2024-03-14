
const express=require("express")
const router=require("./roots/roots")
const mongoose=require("mongoose")
require('dotenv').config();
const bodyParser = require('body-parser');


const app=express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

const PORT = process.env.PORT ;
const password=process.env.password

const urldb=`mongodb+srv://akhras:${password}@akhras.yjxfgn6.mongodb.net/`
mongoose.connect(urldb)
        .then((result)=>console.log("connected to db"))
        .catch((err)=>console.log("err"))


app.set("view engine","ejs")
app.use(router)
app.use(express.static("public"))




app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
