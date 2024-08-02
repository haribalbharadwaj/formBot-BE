const moment = require('moment');
const mongoose = require('mongoose');
const Form = require('../model/form');

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
                ...form.textInputs.map(input => ({ ...input._doc, type: 'textInputs' })),
                ...form.imageInputs.map(input => ({ ...input._doc, type: 'imageInputs' })),
                ...form.videoInputs.map(input => ({ ...input._doc, type: 'videoInputs' })),
                ...form.gifInputs.map(input => ({ ...input._doc, type: 'gifInputs' })),
                ...form.numberInputs.map(input => ({ ...input._doc, type: 'numberInputs' })),
                ...form.phoneInputs.map(input => ({ ...input._doc, type: 'phoneInputs' })),
                ...form.emailInputs.map(input => ({ ...input._doc, type: 'emailInputs' })),
                ...form.dateInputs.map(input => ({ ...input._doc, type: 'dateInputs' })),
                ...form.ratingInputs.map(input => ({ ...input._doc, type: 'ratingInputs' })),
                ...form.buttonInputs.map(input => ({ ...input._doc, type: 'buttonInputs' }))
            ];

            // Sort all inputs by their id
            allInputs.sort((a, b) => a.id - b.id);

            return res.status(200).json({
                message: 'Form found',
                data: {
                    formName: form.formName,
                    refUserId: form.refUserId,
                    textInputs: form.textInputs || [],
                    imageInputs: form.imageInputs || [],
                    videoInputs: form.videoInputs || [],
                    gifInputs: form.gifInputs || [],
                    numberInputs: form.numberInputs || [],
                    emailInputs: form.emailInputs || [],
                    dateInputs: form.dateInputs || [],
                    phoneInputs: form.phoneInputs || [],
                    ratingInputs: form.ratingInputs || [],
                    buttonInputs: form.buttonInputs || []
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
            error: 'Server error'
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

const addForm = async(req,res,next)=>{
    const {
        formName,
        textInputs =[],
          imageInputs=[],
          videoInputs=[],
          gifInputs=[],
          tinputs=[],
          numberInputs=[],
          phoneInputs=[],
          emailInputs=[],
          dateInputs=[],
          ratingInputs=[],
          buttonInputs=[]
    
    } = req.body

    const addSerialNumbers = (...inputsArrays) => {
        let serialNo = 1;
        const combinedInputs = inputsArrays.flat();
        return combinedInputs.map(input => ({ ...input, serialNo: serialNo++ }));
    };
   
    try{

        const allInputs = addSerialNumbers(
            textInputs,
            imageInputs,
            videoInputs,
            gifInputs,
            numberInputs,
            phoneInputs,
            emailInputs,
            dateInputs,
            ratingInputs,
            buttonInputs
        );

        const separateInputs = (type) => allInputs.filter(input => input.type === type);
    
        const newForm = await Form.create({
            formName,
            textInputs,
            textInputs: separateInputs('text'),
            imageInputs: separateInputs('image'),
            videoInputs: separateInputs('video'),
            gifInputs: separateInputs('gif'),
            numberInputs: separateInputs('number'),
            phoneInputs: separateInputs('phone'),
            emailInputs: separateInputs('email'),
            dateInputs: separateInputs('date'),
            ratingInputs: separateInputs('rating'),
            buttonInputs: separateInputs('button'),
            refUserId :  req.refUserId 
        })
        res.status(201).json({
            status:"SUCCESS",
            message:'Form added successfully',
            data: newForm
        })
    }catch(error){
        next({
            message: "Error Adding Form",
            error: error.message
        });
    }
}

// Update an existing form by ID
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

        // Find the form
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Form not found'
            });
        }

        // Update the form fields
        form.formName = formName || form.formName;
        form.textInputs = textInputs || form.textInputs;
        form.imageInputs = imageInputs || form.imageInputs;
        form.videoInputs = videoInputs || form.videoInputs;
        form.gifInputs = gifInputs || form.gifInputs;
        form.tinputs = tinputs || form.tinputs;
        form.numberInputs = numberInputs || form.numberInputs;
        form.phoneInputs = phoneInputs || form.phoneInputs;
        form.emailInputs = emailInputs || form.emailInputs;
        form.dateInputs = dateInputs || form.dateInputs;
        form.ratingInputs = ratingInputs || form.ratingInputs;
        form.buttonInputs = buttonInputs || form.buttonInputs;
        form.refUserId = refUserId || form.refUserId;

        // Increment visit count and update views
        form.visitCount = (form.visitCount || 0) + 1;
        form.views = (form.views || 0) + 1;

        // Ensure startTimes and updateTimes are initialized
        if (!Array.isArray(form.startTimes)) {
            console.log('Initializing startTimes as an empty array');
            form.startTimes = [];
        }
        if (!Array.isArray(form.updateTimes)) {
            console.log('Initializing updateTimes as an empty array');
            form.updateTimes = [];
        }

        console.log('Before push:', {
            startTimes: form.startTimes,
            updateTimes: form.updateTimes
        });

        // Update start and update times
        const currentTime = new Date();
        if (form.startTimes.length === 0) {
            form.startTimes.push(currentTime);
            form.startCount = (form.startCount || 0) + 1;
        } else {
            form.updateTimes.push(currentTime);
        }

        console.log('After push:', {
            startTimes: form.startTimes,
            updateTimes: form.updateTimes
        });

        // Format and update the last update time
        const formattedUpdateTime = moment(currentTime).format('MMM D h:mm A');
        form.lastUpdateTime = formattedUpdateTime;

        // Calculate completion rate
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

        form.completionRate = totalInputs ? (completedInputs / totalInputs) * 100 : 0;

        // Add submission
        const submission = {
            inputs: {
                tinputs,
                numberInputs,
                phoneInputs,
                emailInputs,
                dateInputs,
                ratingInputs,
                buttonInputs
            }
        };
        if (!Array.isArray(form.submissions)) {
            console.log('Initializing submissions as an empty array');
            form.submissions = [];
        }
        form.submissions.push(submission);

        // Save the updated form
        const updatedForm = await form.save();
        console.log('Updated Form:', updatedForm);


        res.json({
            status: "Form updated successfully",
            data: updatedForm
        });
    } catch (error) {
        console.error('Error updating form:', error);
        res.status(500).json({
            status: "Failed",
            message: "Something went wrong"
        });
    }
}

const getFormSubmissions = async (req, res) => {
    try {
        const formId = req.params.id;

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
