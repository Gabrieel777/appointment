const Useer = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = mongoose.model("User", Useer);

class UserService {

    async GetAll(){
        return await User.find();
    };

    async Create(name, email, password){

        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt)

        const newUser = new User({
            name,
            email,
            password: hash
        })

        try {
            await newUser.save();
            return true;
        } catch (err) {
            return false;
        };
    }

    async GetByEmail(email){
        try {
            const user = await User.findOne({"email": email});
            
            if(user != null){        
                return user;
            } else {
                return false;
            }

        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

module.exports = new UserService();