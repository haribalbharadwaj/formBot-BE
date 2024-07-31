const express = require('express');
const router = express.Router();
const verifyToken =require('../middleware/verifyToken');

const {
    getFolder,
    addFolder,
    deleteFolder,
    allFolders
}=require('../controller/folder');


router.get('/folders/:id',verifyToken,getFolder);

router.get('/folders',verifyToken,allFolders);

router.post('/createFolder',addFolder);

router.delete('/deleteFolder/:id', deleteFolder);

module.exports = router;
