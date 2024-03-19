const express=require("express");
const routes = require("./roots/roots");
const mongoose=require("mongoose");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();



const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");
app.use(express.static("public"));


const PORT = process.env.PORT ;
const password=process.env.password

const urldb=`mongodb+srv://akhras:${password}@akhras.yjxfgn6.mongodb.net/`
mongoose.connect(urldb)
        .then((result)=>console.log("connected to db"))
        .catch((err)=>console.log("err"))


// mahtab'public' directory
app.use('/', routes);




app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);