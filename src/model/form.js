const mongoose = require('mongoose');

const inputSchema = new mongoose.Schema({
    id: Number,
    value: String,  // This will be the initial value for display purposes
    visible: Boolean,
    serialNo: { type: Number, default: 0 },
    type: String
});

const submissionSchema = new mongoose.Schema({
    submittedData: {
        textInputs: { type: [inputSchema], default: [] },
        imageInputs: { type: [inputSchema], default: [] },
        videoInputs: { type: [inputSchema], default: [] },
        gifInputs: { type: [inputSchema], default: [] },
        tinputs: { type: [inputSchema], default: [] }, 
        numberInputs: { type: [inputSchema], default: [] },
        emailInputs: { type: [inputSchema], default: [] },
        dateInputs: { type: [inputSchema], default: [] },
        phoneInputs: { type: [inputSchema], default: [] },
        ratingInputs: { type: [inputSchema], default: [] },
        buttonInputs: { type: [inputSchema], default: [] }
    },
    submissionTime: { type: Date, default: Date.now }
});

const formSchema = new mongoose.Schema({
    formName: { type: String, required: true },
    refUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    textInputs: { type: [inputSchema], default: [] },
    imageInputs: { type: [inputSchema], default: [] },
    videoInputs: { type: [inputSchema], default: [] },
    gifInputs: { type: [inputSchema], default: [] },
    tinputs: { type: [inputSchema], default: [] }, 
    numberInputs: { type: [inputSchema], default: [] },
    emailInputs: { type: [inputSchema], default: [] },
    dateInputs: { type: [inputSchema], default: [] },
    phoneInputs: { type: [inputSchema], default: [] },
    ratingInputs: { type: [inputSchema], default: [] },
    buttonInputs: { type: [inputSchema], default: [] },
    visitCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    startTimes: { type: [Date], default: [] },
    updateTimes: { type: [Date], default: [] },
    startCount: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    lastUpdateTime: { type: String },
    submissions: { type: [submissionSchema], default: [] }  // This field stores all the submissions
}, { timestamps: true });

module.exports = mongoose.model('Form', formSchema);
