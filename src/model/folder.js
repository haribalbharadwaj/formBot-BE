const mongoose = require('mongoose');

const folderSchema = mongoose.Schema({
    folderName:{
        type:String,
        required:true
    },createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

const Folder = mongoose.model('Folder',folderSchema);