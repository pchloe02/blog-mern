import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../middleware/errorHandler.js';

const signToken = (id, tokenVersion = 0) =>
    jwt.sign({ id, tokenVersion }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const register = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
        return next(new AppError('Cet email est déjà utilisé', 409));
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });
    const token = signToken(user._id, user.tokenVersion);
    res.status(201).json({ status: 'success', token, data: { user } });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError('Email et mot de passe requis', 400));
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Identifiants invalides', 401));
    }
    const token = signToken(user._id, user.tokenVersion);
    res.status(200).json({ status: 'success', token });
});

const logout = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });
    res.status(200).json({ status: 'success', message: 'Déconnexion réussie' });
});

export { register, login, logout };