import AppError from '../utils/AppError.js';

const handleValidationError = (err) => {

    const errors = Object.values(err.errors).map(el => el.message);
    
    const message = `Données invalides : ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsError = (err) => {

    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    
    const message = `La valeur ${value} existe déjà. Veuillez utiliser une autre valeur.`;
    return new AppError(message, 400);
};


const handleCastError = (err) => {
    const message = `${err.path} invalide : ${err.value}`;
    return new AppError(message, 400);
};

const handleJWTError = () => 
    new AppError('Token invalide. Veuillez vous reconnecter.', 401);


const handleJWTExpiredError = () => 
    new AppError('Votre session a expiré. Veuillez vous reconnecter.', 401);
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        details: err.errors || null
    });
};


const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message
        });
    } 
    else {

        console.error('❌ ERREUR:', err);
        res.status(500).json({
            success: false,
            status: 'error',
            message: 'Une erreur est survenue. Veuillez réessayer plus tard.'
        });
    }
};

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';


    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } 

    else {
        let error = { ...err };
        error.message = err.message;
        error.name = err.name;

        if (error.name === 'CastError') {
            error = handleCastError(error);
        }
        
        if (error.code === 11000) {
            error = handleDuplicateFieldsError(error);
        }
        
        if (error.name === 'ValidationError') {
            error = handleValidationError(error);
        }
        
        if (error.name === 'JsonWebTokenError') {
            error = handleJWTError();
        }
        
        if (error.name === 'TokenExpiredError') {
            error = handleJWTExpiredError();
        }

        sendErrorProd(error, res);
    }
};


const notFound = (req, res, next) => {
    const message = `Route non trouvée : ${req.method} ${req.originalUrl}`;
    next(new AppError(message, 404));
};

export const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

export default {
    errorHandler,
    notFound,
    // catchAsync
};
