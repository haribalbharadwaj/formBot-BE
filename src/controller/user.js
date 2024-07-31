const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
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

const getUser = async(req,res)=>{
    try{
        const userId = req.params.id;
        const user = await User.findById(userId).select('-confirmPassword');
        if (!user) {
            return res.status(404).json({
                status: 'Failure',
                message: 'User not found'
            });
        }
        res.json({
            status: "SUCCESS",
            data: user
        });
    }catch(error){
        res.status(500).json({
            status: 'Failure',
            message: 'Something went wrong'
        });
    }
}

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
        console.log('Request Body:', req.body);
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email});
        const JWT_Private_Key = process.env.Private_key;

        if (!existingUser) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
       
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
                    userName:existingUser.userName,
                    token,
                    userId: existingUser._id
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

const updateUser = async (req,res)=>{
    try{
        const userId = req.params.id;
        const {userName,email, oldPassword, newPassword} = req.body;

        console.log('Update request:', { userId, userName, email, oldPassword, newPassword });

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 'Failure',
                message: 'User not found'
            });
        }

        console.log('Found user:', user);

        if (!oldPassword || !user.password) {
            return res.status(400).json({
                message: 'Old password is required'
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Incorrect old password'
            });
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);

        user.userName = userName || user.userName;
        user.email = email || user.email;
        user.password = encryptedPassword;

        await user.save();

        res.json({
            status: 'SUCCESS',
            message: 'User updated successfully'
        });

    }catch(error){
        console.error('Error updating user:', error);
        res.status(500).json({
            status: 'Failure',
            message: 'Something went wrong'
        });

    }
}

module.exports = {
    getUser,
    getUsers,
    registerUser,
    loginUser,
    updateUser
};
