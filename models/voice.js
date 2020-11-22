// Dependencies
const mongoose = require('mongoose')

// Schema
const { Schema } = mongoose
const voiceSchema = new Schema(
    {
        url: {
            type: String,
            required: true,
        },
        engine: {
            type: String,
            required: true,
            default: 'wit',
            enum: ['wit', 'google'],
        },
        duration: {
            type: Number,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        text: String,
        textWithTimecodes: [[String]],
        fileId: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
)

// Exports
module.exports = mongoose.model('voice', voiceSchema)
