import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isSuperAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    status: {
        type: String,
        required: true,
        default: Inactive,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    lastLogin: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
})

adminSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

adminSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const Admin = mongoose.model('Admin', adminSchema)

export default Admin