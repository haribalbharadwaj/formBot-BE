const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getUser = async (req, res) => {
    try {
        const users = await User.find().select('-confirmPassword')
        res.json({
            status: "SUCCESS",
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failure',
            message: 'Something went wrong'
        });
    }
};

const registerUser = async (req, res) => {
    try {
        const { userName, email, password, confirmPassword } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists, please login or use another email address'
            });
        } else {
            if (password != confirmPassword) {
                return res.status(400).json({
                    message: 'Passwords do not match'
                });
            }

            const encryptedPassword = await bcrypt.hash(password, 10);
            await User.create({
                userName,
                email,
                password: encryptedPassword
            });
            res.json({
                status: "SUCCESS",
                message: 'User Signup successful'
            });
        }
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({
            status: 'Failure',
            message: 'Something went wrong'
        });
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        const JWT_Private_Key = process.env.Private_key;
       
        if (existingUser) {
            const correctPassword = await bcrypt.compare(password, existingUser.password);
            if (correctPassword) {
                const token = jwt.sign(
                    { userID: existingUser._id }, 
                    JWT_Private_Key,
                    { expiresIn: '1h' }
                );
                return res.status(200).json({
                    message: 'User login successful',
                    email: existingUser.email,
                    token
                });
            } else {
                return res.status(400).json({
                    message: 'Invalid credentials'
                });
            }
        } else {
            return res.status(400).json({
                message: 'User not found'
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUser,
    registerUser,
    loginUser
};
