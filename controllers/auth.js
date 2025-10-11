import passport from "passport";
import models from "../models/index.js";
const { User, Category, Question } = models;

export default {
  getLoginPage: async (req, res) => {
    res.render('login');
  },
  
  getRegisterPage: async (req, res) => {
    res.render('register');
  },
  
  login: (req,res,next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      console.log({user})
      if (!user) {
        // req.flash('error', info.message);
        return res.redirect('/auth');
      }

      req.login(user, (err) => {
        console.log({user,err})
        if (err) return next(err);
        return res.redirect('/practice');
      });
    })(req, res, next);
  },

  logout: (req,res,next) => {
    req.logout((e) => {
      if (e) return next(e);
      res.redirect('/');
    })
  },

  registerNewUser: async (req,res) => {
    console.log('ive at least been accessed')
    const {
      email,
      password,
      username
    } = req.body;

    const validChars = new Set(' abcdefghijklmnopqrstuvwxyz0123456789,./+=-!@#$%^&*_');
    const nameUsesValidChars = username.toLowerCase().split('').every(char => validChars.has(char));
    const nameIsProperLength = 3 <= username.trim().length && username.trim().length <= 40;
    const passwordUsesValidChars = password.toLowerCase().split('').every(char => validChars.has(char));
    const passwordIsValidLength = password.trim().length >= 8 && password.trim().length <= 20;

    const validUsername = nameUsesValidChars && nameIsProperLength;
    const validPassword = passwordUsesValidChars && passwordIsValidLength;

    if (!validUsername) return res.status(400).json({message:'invalid username'});
    if (!validPassword) return res.status(400).json({message: 'invalid password'});

    try {
      const user = await User.create({email,username,password});
      return res.status(201).json(user)
    }
    catch (e){
      let message = e.message;
      if (e.code === 11000){
        if (e.keyPattern.email) message = 'Email already Registered'
        if (e.keyPattern.username) message = 'Username is already Taken'
      }
      return res.status(400).json({ message })
    }

  },

};
