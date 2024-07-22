const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const userRoutes = require('./src/routes/user');
const errorHandler = require('./src/middleware/errorHandler');
const folderRoutes = require('./src/routes/folder');

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/user',userRoutes);
app.use('/folder',folderRoutes);
app.use(errorHandler);

Port = process.env.PORT;


app.get('/',(req,res)=>{
    res.json({
        message:'Form creating app is working fine',
        status:'Server is up',
        now:new Date().toLocaleDateString()
    });
});

mongoose.connect(process.env.MongoDBUrl)
    .then(()=>{
        console.log('MongoDB conneted');
    })
    .catch((error)=>{
        console.error('Mongodb connection error');
    });

app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
});