const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const { getForm, addForm, deleteForm, allForms, updateForm, getFormSubmissions } = require('../controller/form.js');

router.get('/forms/:userId',verifyToken, allForms);

router.get('/getForm/:formId', getForm);

router.get('/response/:formId', getFormSubmissions); 

router.post('/addForm', verifyToken, addForm);

router.put('/updateForm/:id', updateForm);

router.delete('/deleteForm/:id', deleteForm);

module.exports = router;
