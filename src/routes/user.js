const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validateUser');

const {
    getUser,
    registerUser,
    loginUser
}= require('../controller/user');

router.get('/users',getUser);

router.post('/register',validateUser,registerUser);

router.post('/login',loginUser);

console.log('User routes registered');

module.exports= router;


