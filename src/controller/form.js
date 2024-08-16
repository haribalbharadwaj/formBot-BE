const moment = require('moment');
const mongoose = require('mongoose');
const Form = require('../model/form');

// Helper function to assign serial numbers
const addSerialNumbers = (inputs = [], type) => {
    if (!Array.isArray(inputs)) {
        console.error(`Expected an array but received ${typeof inputs} for type ${type}`);
        return []; // Return an empty array if inputs is not an array
    }
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

            const allInputs = [
                ...form.textInputs,
                ...form.imageInputs,
                ...form.videoInputs,
                ...form.gifInputs,
                ...form.tinputs,
                ...form.numberInputs,
                ...form.phoneInputs,
                ...form.emailInputs,
                ...form.dateInputs,
                ...form.ratingInputs,
                ...form.buttonInputs
            ].sort((a, b) => a.serialNo - b.serialNo);

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
        tinputs = [],
        numberInputs = [],
        phoneInputs = [],
        emailInputs = [],
        dateInputs = [],
        ratingInputs = [],
        buttonInputs = []
    } = req.body;

    console.log('Request Body:', req.body);

    try {
        const newForm = new Form({
            formName,
            refUserId: req.refUserId,
            textInputs: addSerialNumbers(textInputs, 'textInputs'),
            imageInputs: addSerialNumbers(imageInputs, 'imageInputs'),
            videoInputs: addSerialNumbers(videoInputs, 'videoInputs'),
            gifInputs: addSerialNumbers(gifInputs, 'gifInputs'),
            tinputs: addSerialNumbers(tinputs, 'tinputs'),
            numberInputs: addSerialNumbers(numberInputs, 'numberInputs'),
            phoneInputs: addSerialNumbers(phoneInputs, 'phoneInputs'),
            emailInputs: addSerialNumbers(emailInputs, 'emailInputs'),
            dateInputs: addSerialNumbers(dateInputs, 'dateInputs'),
            ratingInputs: addSerialNumbers(ratingInputs, 'ratingInputs'),
            buttonInputs: addSerialNumbers(buttonInputs, 'buttonInputs')
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

        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Form not found'
            });
        }

        // Update form fields
        form.formName = formName || form.formName;
        form.textInputs = addSerialNumbers(textInputs, 'textInputs');
        form.imageInputs = addSerialNumbers(imageInputs, 'imageInputs');
        form.videoInputs = addSerialNumbers(videoInputs, 'videoInputs');
        form.gifInputs = addSerialNumbers(gifInputs, 'gifInputs');
        form.tinputs = addSerialNumbers(tinputs, 'tinputs');
        form.numberInputs = addSerialNumbers(numberInputs, 'numberInputs');
        form.phoneInputs = addSerialNumbers(phoneInputs, 'phoneInputs');
        form.emailInputs = addSerialNumbers(emailInputs, 'emailInputs');
        form.dateInputs = addSerialNumbers(dateInputs, 'dateInputs');
        form.ratingInputs = addSerialNumbers(ratingInputs, 'ratingInputs');
        form.buttonInputs = addSerialNumbers(buttonInputs, 'buttonInputs');
        form.refUserId = refUserId || form.refUserId;

        form.visitCount = (form.visitCount || 0) + 1;
        form.views = (form.views || 0) + 1;

        // Ensure arrays are properly initialized
        form.startTimes = Array.isArray(form.startTimes) ? form.startTimes : [];
        form.updateTimes = Array.isArray(form.updateTimes) ? form.updateTimes : [];

        const currentTime = new Date();
        if (form.startTimes.length === 0) {
            form.startTimes.push(currentTime);
            form.startCount = (form.startCount || 0) + 1;
        } else {
            form.updateTimes.push(currentTime);
        }

        form.lastUpdateTime = moment(currentTime).format('MMM D YYYY, h:mm:ss a');

        // Calculate completion rate
        const totalInputs = form.textInputs.length + form.imageInputs.length + form.videoInputs.length +
                            form.gifInputs.length + form.tinputs.length + form.numberInputs.length +
                            form.phoneInputs.length + form.emailInputs.length + form.dateInputs.length +
                            form.ratingInputs.length + form.buttonInputs.length;
        const completedInputs = form.textInputs.filter(input => input.value).length +
                                form.imageInputs.filter(input => input.value).length +
                                form.videoInputs.filter(input => input.value).length +
                                form.gifInputs.filter(input => input.value).length +
                                form.tinputs.filter(input => input.value).length +
                                form.numberInputs.filter(input => input.value).length +
                                form.phoneInputs.filter(input => input.value).length +
                                form.emailInputs.filter(input => input.value).length +
                                form.dateInputs.filter(input => input.value).length +
                                form.ratingInputs.filter(input => input.value).length +
                                form.buttonInputs.filter(input => input.value).length;

        form.completionRate = totalInputs === 0 ? 0 : (completedInputs / totalInputs) * 100;

        // Save the updated form
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

// Add a submission to a form
const addFormSubmission = async (req, res) => {
    try {
        const formId = req.params.id
        const submissionData = req.body;

        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Form not found'
            });
        }

        // Add serial numbers to the inputs in the submission
        const newSubmission = {
            submittedData: {
                textInputs: addSerialNumbers(submissionData.textInputs, 'textInputs'),
                imageInputs: addSerialNumbers(submissionData.imageInputs, 'imageInputs'),
                videoInputs: addSerialNumbers(submissionData.videoInputs, 'videoInputs'),
                gifInputs: addSerialNumbers(submissionData.gifInputs, 'gifInputs'),
                tinputs: addSerialNumbers(submissionData.tinputs, 'tinputs'),
                numberInputs: addSerialNumbers(submissionData.numberInputs, 'numberInputs'),
                phoneInputs: addSerialNumbers(submissionData.phoneInputs, 'phoneInputs'),
                emailInputs: addSerialNumbers(submissionData.emailInputs, 'emailInputs'),
                dateInputs: addSerialNumbers(submissionData.dateInputs, 'dateInputs'),
                ratingInputs: addSerialNumbers(submissionData.ratingInputs, 'ratingInputs'),
                buttonInputs: addSerialNumbers(submissionData.buttonInputs, 'buttonInputs')
            },
            submissionTime: new Date()
        };

        form.submissions.push(newSubmission);
        form.views += 1;

        const updatedForm = await form.save();

        res.status(201).json({
            status: 'SUCCESS',
            message: 'Submission added successfully',
            data: updatedForm
        });

    } catch (error) {
        console.error('Error adding submission:', error);
        res.status(500).json({
            status: 'Failed',
            message: 'Error adding submission',
            error: error.message
        });
    }
};

// Get all submissions for a form
const getFormSubmissions = async (req, res) => {
    try {
        const { formId } = req.params;

        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Form not found'
            });
        }

        res.status(200).json({
            status: 'SUCCESS',
            message: 'Submissions found',
            data: form.submissions
        });

    } catch (error) {
        console.error('Error fetching form submissions:', error);
        res.status(500).json({
            status: 'Failed',
            message: 'Error fetching submissions',
            error: error.message
        });
    }
};

// Delete a form
const deleteForm = async (req, res, next) => {
    try {
        const formId = req.params.id;
        
        const deletedForm = await Form.findByIdAndDelete(formId);
        
        if (!deletedForm) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Form not found'
            });
        }

        res.status(200).json({
            status: "SUCCESS",
            message: 'Form deleted successfully'
        });
    } catch (error) {
        next({
            message: 'Error deleting form',
            error: error.message
        });
    }
};

module.exports = {
    getForm,
    allForms,
    addForm,
    updateForm,
    addFormSubmission,
    getFormSubmissions,
    deleteForm
};
