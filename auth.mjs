import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const User = mongoose.model('User');


const startAuthenticatedSession = (req, user) => {
  return new Promise((fulfill, reject) => {
    req.session.regenerate((err) => {
      if (!err) {
        req.session.user = user;
        fulfill(user);
      } else {
        reject(err);
      }
    });
  });
};


const endAuthenticatedSession = (req) => {
  return new Promise((fulfill, reject) => {
    req.session.destroy(err => err ? reject(err) : fulfill(null));
  });
};


const register = async (username, email, password) => {
  if (username.length < 8 || password.length < 8) {
    throw { message: 'USERNAME OR PASSWORD TOO SHORT (BOTH NEED TO BE MORE THAN 8 WORDS)' };
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    if (existingUser.username === username) {
      throw { message: 'USERNAME ALREADY EXISTS' };
    }
    if (existingUser.email === email) {
      throw { message: 'EMAIL ALREADY REGISTERED' };
    }
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = new User({
    username: username,
    password: hash,
    email: email,
  });

  await user.save();
  return user;
};

const login = async (username, password) => {
    const existingUser = await User.findOne({ username: username });
  
    if (existingUser) {
      if (bcrypt.compareSync(password, existingUser.password)) {
        return existingUser;
      } else {
        throw { message: 'PASSWORDS DO NOT MATCH' };
      }
    } else {
      throw { message: 'USER NOT FOUND' };
    }
  };
  

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login
};
