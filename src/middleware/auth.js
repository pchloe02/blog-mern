import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from './errorHandler.js';

const protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return next(new AppError('Non authentifié', 401));

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return next(new AppError('Token invalide ou expiré.', 401));
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return next(new AppError('Utilisateur introuvable', 401));


    const decodedTV = typeof decoded.tokenVersion === 'undefined' ? 0 : decoded.tokenVersion;
    if (decodedTV !== user.tokenVersion) {
        return next(new AppError('Token révoqué. Veuillez vous reconnecter.', 401));
    }
    req.user = user;
    next();
});

export { protect };