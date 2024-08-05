const moment = require('moment');
const mongoose = require('mongoose');
const Form = require('../model/form');


// Helper function to assign serial numbers
const addSerialNumbers = (inputs, type) => {
    return inputs.map((input, index) => ({
        ...input,
        serialNo: index + 1, // Assigning serial numbers based on final index
        type
    }));
};

// Get form by ID
const getForm = async (req, res) => {
    try {
        const { formId } = req.params;
        console.log('Fetching form with ID:', formId);
        
        const form = await Form.findById(formId);
        
        if (form) {
            console.log('Form found:', form);

            // Combine all inputs into a single array
            const allInputs = [
                ...addSerialNumbers(form.textInputs, 'textInputs'),
                ...addSerialNumbers(form.imageInputs, 'imageInputs'),
                ...addSerialNumbers(form.videoInputs, 'videoInputs'),
                ...addSerialNumbers(form.gifInputs, 'gifInputs'),
                ...addSerialNumbers(form.tinputs, 'tinputs'),
                ...addSerialNumbers(form.numberInputs, 'numberInputs'),
                ...addSerialNumbers(form.phoneInputs, 'phoneInputs'),
                ...addSerialNumbers(form.emailInputs, 'emailInputs'),
                ...addSerialNumbers(form.dateInputs, 'dateInputs'),
                ...addSerialNumbers(form.ratingInputs, 'ratingInputs'),
                ...addSerialNumbers(form.buttonInputs, 'buttonInputs')
            ];

            // Sort all inputs by their serialNo
            allInputs.sort((a, b) => a.serialNo - b.serialNo);

            return res.status(200).json({
                message: 'Form found',
                data: {
                    formName: form.formName,
                    refUserId: form.refUserId,
                    inputs: allInputs
                }
            });
        } else {
            console.log('Form not found for ID:', formId);
            return res.status(404).json({
                status: 'Failed',
                message: 'Form not found'
            });
        }
    } catch (error) {
        console.error('Error fetching form data:', error);
        res.status(500).json({
            status: "Failed",
            message: "Something went wrong",
            error: error.message
        });
    }
};

// Get all forms by user ID
const allForms = async (req, res) => {
    try {
        const userId = req.params.userId;
        const forms = await Form.find({ refUserId: userId });

        if (forms.length > 0) {
            return res.status(200).json({ status: 'SUCCESS', data: forms });
        } else {
            return res.status(404).json({ status: 'ERROR', message: 'No forms found' });
        }
    } catch (error) {
        console.error('Error in getForm:', error);
        return res.status(500).json({ status: 'ERROR', message: 'Failed to fetch forms' });
    }
};

// Add a new form
const addForm = async (req, res, next) => {
    const {
        formName,
        textInputs = [],
        imageInputs = [],
        videoInputs = [],
        gifInputs = [],
        tinputs = [], // Text inputs for Formbot
        numberInputs = [],
        phoneInputs = [],
        emailInputs = [],
        dateInputs = [],
        ratingInputs = [],
        buttonInputs = []
    } = req.body;

    console.log('Request Body:', req.body);

    try {
        const allInputs = [
            ...addSerialNumbers(textInputs, 'textInputs'),
            ...addSerialNumbers(imageInputs, 'imageInputs'),
            ...addSerialNumbers(videoInputs, 'videoInputs'),
            ...addSerialNumbers(gifInputs, 'gifInputs'),
            ...addSerialNumbers(tinputs, 'tinputs'),
            ...addSerialNumbers(numberInputs, 'numberInputs'),
            ...addSerialNumbers(phoneInputs, 'phoneInputs'),
            ...addSerialNumbers(emailInputs, 'emailInputs'),
            ...addSerialNumbers(dateInputs, 'dateInputs'),
            ...addSerialNumbers(ratingInputs, 'ratingInputs'),
            ...addSerialNumbers(buttonInputs, 'buttonInputs')
        ];

        const newForm = new Form({
            formName,
            textInputs: allInputs.filter(input => input.type === 'textInputs'),
            imageInputs: allInputs.filter(input => input.type === 'imageInputs'),
            videoInputs: allInputs.filter(input => input.type === 'videoInputs'),
            gifInputs: allInputs.filter(input => input.type === 'gifInputs'),
            tinputs: allInputs.filter(input => input.type === 'tinputs'),
            numberInputs: allInputs.filter(input => input.type === 'numberInputs'),
            phoneInputs: allInputs.filter(input => input.type === 'phoneInputs'),
            emailInputs: allInputs.filter(input => input.type === 'emailInputs'),
            dateInputs: allInputs.filter(input => input.type === 'dateInputs'),
            ratingInputs: allInputs.filter(input => input.type === 'ratingInputs'),
            buttonInputs: allInputs.filter(input => input.type === 'buttonInputs'),
            refUserId: req.refUserId
        });

        await newForm.save();

        res.status(201).json({
            status: "SUCCESS",
            message: 'Form added successfully',
            data: newForm
        });

        console.log('New Form:', newForm);
    } catch (error) {
        next({
            message: "Error Adding Form",
            error: error.message
        });
    }
};

// Update a form
const updateForm = async (req, res) => {
    try {
        const formId = req.params.id;
        const {
            formName,
            textInputs = [],
            imageInputs = [],
            videoInputs = [],
            gifInputs = [],
            tinputs = [],
            numberInputs = [],
            phoneInputs = [],
            emailInputs = [],
            dateInputs = [],
            ratingInputs = [],
            buttonInputs = [],
            refUserId
        } = req.body;

        console.log('Received payload:', req.body);

        const allInputs = [
            ...addSerialNumbers(textInputs, 'textInputs'),
            ...addSerialNumbers(imageInputs, 'imageInputs'),
            ...addSerialNumbers(videoInputs, 'videoInputs'),
            ...addSerialNumbers(gifInputs, 'gifInputs'),
            ...addSerialNumbers(tinputs, 'tinputs'),
            ...addSerialNumbers(numberInputs, 'numberInputs'),
            ...addSerialNumbers(phoneInputs, 'phoneInputs'),
            ...addSerialNumbers(emailInputs, 'emailInputs'),
            ...addSerialNumbers(dateInputs, 'dateInputs'),
            ...addSerialNumbers(ratingInputs, 'ratingInputs'),
            ...addSerialNumbers(buttonInputs, 'buttonInputs')
        ];

        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Form not found'
            });
        }

        form.formName = formName || form.formName;
        form.textInputs = allInputs.filter(input => input.type === 'textInputs');
        form.imageInputs = allInputs.filter(input => input.type === 'imageInputs');
        form.videoInputs = allInputs.filter(input => input.type === 'videoInputs');
        form.gifInputs = allInputs.filter(input => input.type === 'gifInputs');
        form.tinputs = allInputs.filter(input => input.type === 'tinputs');
        form.numberInputs = allInputs.filter(input => input.type === 'numberInputs');
        form.phoneInputs = allInputs.filter(input => input.type === 'phoneInputs');
        form.emailInputs = allInputs.filter(input => input.type === 'emailInputs');
        form.dateInputs = allInputs.filter(input => input.type === 'dateInputs');
        form.ratingInputs = allInputs.filter(input => input.type === 'ratingInputs');
        form.buttonInputs = allInputs.filter(input => input.type === 'buttonInputs');
        form.refUserId = refUserId || form.refUserId;

        form.visitCount = (form.visitCount || 0) + 1;
        form.views = (form.views || 0) + 1;

        if (!Array.isArray(form.startTimes)) {
            form.startTimes = [];
        }
        if (!Array.isArray(form.updateTimes)) {
            form.updateTimes = [];
        }

        const currentTime = new Date();
        if (form.startTimes.length === 0) {
            form.startTimes.push(currentTime);
            form.startCount = (form.startCount || 0) + 1;
        } else {
            form.updateTimes.push(currentTime);
        }

        const formattedUpdateTime = moment(currentTime).format('MMM D YYYY, h:mm:ss a');
        form.lastUpdateTime = formattedUpdateTime;

        const totalInputs = form.tinputs.length + form.numberInputs.length +
                            form.phoneInputs.length + form.emailInputs.length +
                            form.dateInputs.length + form.ratingInputs.length +
                            form.buttonInputs.length;

        const completedInputs = form.tinputs.filter(input => input.value).length +
                                form.numberInputs.filter(input => input.value).length +
                                form.phoneInputs.filter(input => input.value).length +
                                form.emailInputs.filter(input => input.value).length +
                                form.dateInputs.filter(input => input.value).length +
                                form.ratingInputs.filter(input => input.value).length +
                                form.buttonInputs.filter(input => input.value).length;

        form.completionRate = totalInputs === 0 ? 0 : (completedInputs / totalInputs) * 100;

        const updatedForm = await form.save();

        res.status(200).json({
            status: "SUCCESS",
            message: "Form updated successfully",
            data: updatedForm
        });

        console.log('Updated Form:', updatedForm);
    } catch (error) {
        console.error('Error updating form:', error);
        res.status(500).json({
            status: "Failed",
            message: "Something went wrong",
            error: error.message
        });
    }
};

const getFormSubmissions = async (req, res) => {
    try {
        console.log('Request params:', req.params);
        const formId = req.params.formId;
        console.log('Received form ID:', formId);

        if (!mongoose.Types.ObjectId.isValid(formId)) {
            return res.status(400).send({ message: 'Invalid form ID' });
        }

        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).send({ message: 'Form not found' });
        }

        res.status(200).send({ data: form });
    } catch (error) {
        console.error('Error fetching form submissions:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

// Delete a form by ID
const deleteForm = async(req,res,next)=>{
    try{
        const formId = req.params.id;
        await Form.findByIdAndDelete(formId);
        res.status(200).json({
            message:'Form deleted successfully'
        })
    }
    catch(error){
        next('Error deleting form', error);
    }

}

module.exports = { getForm, addForm, deleteForm, allForms, updateForm,getFormSubmissions };