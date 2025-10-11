import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from "./models/users.js";


passport.use(new LocalStrategy(
  {usernameField: "provided"},
  async function(provided, password, done){
    try{
      const user = await User.findOne({
        $or:[
          {email:provided},
          {username:provided},
        ]
      })
      if (!user) return done(null, false, {message: "invalid credentials"});

      const isMatch = await user.comparePassword(password);
      if (!isMatch) return done(null,false,{message: "invalid password"});

      return done(null,user);
    }catch(e){
      return done(e);
    }
  }
));

passport.serializeUser((user,done) => {
  done(null,user._id);
});

passport.deserializeUser(async (id,done) => {
  try{
    const user = await User.findById(id);
    done(null,user);
  }catch{
    done(err);
  }
})

export default passport;