//sets up passport with the local authentication strategy using a person model for user

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Person = require('./models/Person')

passport.use(new LocalStrategy(async(USERNAME,password,done)=>{
    //authentication logic here
    try{
        //console.log("received credentials - ",USERNAME,password);
        const user = await Person.findOne({username:USERNAME});

        if(!user){
            return done(null, false, {message:"Incorrect username"});
        }

        const isPasswordMatch = await user.comparePassword(password);

        if(isPasswordMatch){
            return done(null,user)
        }
        else{
            return done(null,false,{message:"Password does not match"})
        }
    }
    catch(err){
        return done(err);
    }
}))

module.exports = passport; //export configured passport