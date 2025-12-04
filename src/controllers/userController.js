import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../middleware/errorHandler.js';

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

const getMe = catchAsync(async (req, res, next) => {
    if (!req.user || !req.user._id) {
        return next(new AppError('User not authenticated', 401));
    }
    const user = await User.findById(req.user._id).select('-password')
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        messagfe: 'User data retrieved successfully',
        data: {
            user
        }
    });
})

const updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('Cannot update password here', 400));
    }

    const filteredBody = filterObj(req.body, 'name', 'email');

    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new AppError('User not found.', 404));
    }

    Object.keys(filteredBody).forEach(key => {
        user[key] = filteredBody[key];
    });

    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'User updated successfully',
        data: {
            user
        }
    });
});

const updatePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return next(new AppError('Current and new passwords are required.', 400));
    }
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
        return next(new AppError('Utilisateur introuvable.', 404));
    }

    if (!(await user.correctPassword(currentPassword, user.password))) {
        return next(new AppError('Le mot de passe actuel est incorrect.', 401));
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Password updated successfully'
    });
});

export { getMe, updateMe, updatePassword };