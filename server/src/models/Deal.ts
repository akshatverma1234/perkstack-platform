import mongoose from 'mongoose'

const dealSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    partnerName: {
        type: String,
        required: true
    },
    logoUrl: {
        type: String
    },
    conditions: {
        type: String
    },
    isLocked: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        required: true
    },
    partnerLink: {
        type: String
    },
    discountValue: {
        type: String
    }
}, {
    timestamps: true
})

export const Deal = mongoose.model('Deal', dealSchema)
