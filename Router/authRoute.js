const express = require('express');

const authRouter = express.Router();
const authController = require('../Controller/authController');

authRouter.post('/register',authController.postUserData);

authRouter.post('/login',authController.postLogin);

module.exports=authRouter;

