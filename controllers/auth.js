import models from "../models/index.js";
const { User, Category, Question } = models;

export default {
  getLogin: async (req, res) => {
    res.render('auth');
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
    catch (e){return res.status(400).json({message: e.message})}

  },

  login: async (req,res) => {
    res.json({fight:"me"});
  },
};
