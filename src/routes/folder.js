const express = require('express');
const router = express.Router();

const {
    getFolder,
    addFolder,
    deleteFolder
}=require('../controller/folder');

router.get('/folders',getFolder);

router.post('createFolder',addFolder);

router.delete('deleteFolder', deleteFolder);

module.exports = router;
