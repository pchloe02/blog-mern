import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom est requis']
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    tokenVersion: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();

});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
};

export default mongoose.model('User', userSchema);