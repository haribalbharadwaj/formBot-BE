const mongoose = require('mongoose');

const inputSchema = new mongoose.Schema({
    id: Number,
    value: String,
    visible: Boolean,
    serialNo: { type: Number, default: 0 }
  });
  
  const formSchema = new mongoose.Schema({
    formName: { type: String, required: true },
    refUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    textInputs: { type: [inputSchema]},
    imageInputs: { type: [inputSchema]},
    videoInputs: { type: [inputSchema]},
    gifInputs: { type: [inputSchema]},
    tinputs: { type: [inputSchema]}, 
    numberInputs: { type: [inputSchema]},
    emailInputs: { type: [inputSchema]},
    dateInputs: { type: [inputSchema]},
    phoneInputs: { type: [inputSchema]},
    ratingInputs: { type: [inputSchema]},
    buttonInputs: { type: [inputSchema]},
    visitCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    startTimes: { type: [Date], default: [] },
    updateTimes: { type: [Date], default: [] },
    startCount: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    lastUpdateTime: { type: String }
  }, { timestamps: true });
  
module.exports = mongoose.model('Form', formSchema);

