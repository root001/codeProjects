import mongoose from 'mongoose'

const invoiceSchema = mongoose.Schema({
    SN: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true,

    },
    status: {
        type: String,
        required: true,
        default: sent,
    },
    inVoiceURL: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
   
})


const Invoice = mongoose.model('Invoice', invoiceSchema)

export default Invoice