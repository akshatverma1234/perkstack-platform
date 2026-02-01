import mongoose from 'mongoose'

const verificationSchema = new mongoose.Schema({
    verified: {
        type: Boolean,
        default: false
    },
    verificationDate: Date
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    verification: verificationSchema
}, {
    timestamps: true
})

export const User = mongoose.model('User', userSchema)
