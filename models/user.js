const mongoose = require('mongoose')
const moment = require("moment");
const users = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "Please enter your name!"],
        maxLength: [15, "Name must be less than 15 characters"],
      },
      PassWord: {
        type: srtring ,
        required: [true, "err"],
        validate: {
            validator:(v)=>{
                if (v.length < 8) {
                    return false;
                  }
                const specialCharacter = /[!@#$%^&*()\-_=+{};:'",<.>/?[\]\\]/;
                const uppercase = /[A-Z]/;
                const Lowercase = /[a-z]/;
                const Numbercase = /[1-9]/;
                return ( specialCharacter.test(v)&&
                         uppercase.test(v)&&
                         Lowercase.test(v)&&
                         Numbercase.test(v)
                   )
            },
            message: props => `${props.value} does not meet the password requirements`
        },
      },
      email:{
         type:email,
         require:[true,"Please enter your email !"]  
      },
      phoneNumber: {
        type: String,
        required: [true, "Please enter a phone number!"],
        trim: true,
        validate: {
            validator: function(v) {
                return /^(?:\+31|0)(?:\d[\s-]?){9}\d$/.test(v);
            },
             message: props => `${props.value} is not a valid Dutch phone number!`
        }
    },
      createdAt: {
        type: Date,
        default: Date.now,
        get: function (createdAt) {
          return moment(createdAt).format("MMMM Do YYYY ");
        },
      },
      updatedAt: {
        type: Date,
        default: Date.now,
        get: function (createdAt) {
          return moment(createdAt).format("MMMM Do YYYY ");
        },
      },
    IpAdress:{
        type: [String],
        required: [true, "Please enter an IP address!"],
        validate: {
            validator: function(v) {
                const ipAddressRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:$|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:(:[0-9a-fA-F]{1,4}){1,6}$|:^:(:[0-9a-fA-F]{1,4}){1,7}$|^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$|localhost$|localhost\.localdomain$|localhost\.local$|loc$^/
                return ipAddressRegex.test(v);
            },
            message: props => `${props.value} is not a valid IP address!`
        }
    }
    },
  );

const Feeds = mongoose.model('users', users);

module.exports = Feeds;