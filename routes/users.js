const express = require('express');
const router = express.Router();

const config = require('./config');


const jwt = require('jsonwebtoken');

const UserService = require('../services/user-service');
const User = require('../models/user');
const Boom = require('boom');


const decodeToken = (req, res, next) => {
  const Token = req.headers['access-token'];
  if (!Token){
    return res.status(403).json({
      message: 'No Token provided'
    });
  }
  jwt.verify(Token, config.secret, (err, decoded)=> {
    if (err){
      res.status(401).json({
        message: 'Failed authenticating token.'
      });
    }else {
      req.decoded = decoded;
      next();
    }
  });

};
const validateUser= async (req, res, next)=>{
  const {_id} = req.decoded;

  try{
    const user = await UserService.findById(_id).exec();

    if (!user){
      return res.status(401).json({
        message: 'Failed authenticating token.'
      });
    }
    req.user = user;
    next();
  }catch(err){
    console.error(err);
    res.status(401).json({message: 'Failed authenticating token.'});
  }
};

const sendToken = (req, res) =>{
  const {user} = req;
  const payload = {
    _id: user._id
  };
  const token = jwt.sign(payload, config.secret, {
    expiresIn: 60 * 60 * 24         // 24 Hours
  });

  res.json({
    message: 'this is your token!', token
  });
};

/*New User*/
router.post('/signup', async(req, res, next) => {
  console.log(req.body);
  try {
    const user = await UserService.create(req.body);
    console.log(user);
    req.user = user;
    next();
  } catch(err){
    if(err.name === 'ValidationError'){
      next(Boom.badRequest(err));
    }
  }
},sendToken);


/* sign in a user */
router.post('/signin', async(req, res, next) => {
  const {username, password} = req.body;
  if (!username || !password) {
    next(Boom.badRequest('username or password missing'));
  }
  try {

    const user = await User.findOne({username});
    if(!user || !user.authenticate(password)){
      next(Boom.unauthorized('Authentication failed'));
    }
    req.user= user;
    next();
  } catch(err){
    console.error(err);
    next(Boom.notFound('No such a username'));
  }
}, sendToken);


router.use(decodeToken, validateUser);
module.exports = router;
