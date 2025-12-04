import Article from '../models/Article.js';
import QueryFeatures from '../utils/queryFeatures.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../middleware/errorHandler.js';



const createArticle = catchAsync(async (req, res, next) => {
    const { titre, contenu, categorie } = req.body;
    const article = new Article({
        titre,
        contenu,
        auteur: {
            id: req.user._id,
            name: req.user.name
        },
        categorie
    });

    const articleSauvegarde = await article.save();
    res.status(201).json({
        success: true,
        message: 'Article créé avec succès',
        data: articleSauvegarde
    });
});

const getAllArticles = catchAsync(async (req, res, next) => {
    const totalCount = await Article.countDocuments();
    const features = new QueryFeatures(Article.find(), req.query)
        .filter()
        .search()
        .sort()
        .limitFields()
        .paginate();

    const articles = await features.query;

    const paginationInfo = features.getPaginationInfo(totalCount);

    const response = {
        success: true,
        count: articles.length,
        totalCount: totalCount,
        data: articles
    };

    if (paginationInfo) {
        response.pagination = paginationInfo;
    }

    res.status(200).json(response);
});


const getArticleById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
        return next(new AppError('Article non trouvé', 404));
    }

    await article.incrementerVues();

    res.status(200).json({
        success: true,
        data: article
    });
});

const updateArticle = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const article = await Article.findByIdAndUpdate(
        id,
        req.body,
        {
            new: true,              // Retourne le document modifié
            runValidators: true     // Exécute les validations
        }
    );

    if (!article) {
        return next(new AppError('Article non trouvé', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Article mis à jour avec succès',
        data: article
    });
});

const deleteArticle = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const article = await Article.findByIdAndDelete(id);
    if (!article) {
        return next(new AppError('Article non trouvé', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Article supprimé avec succès',
        data: article
    });
});
const getPublishedArticles = catchAsync(async (req, res, next) => {
    const articles = await Article.findPublies();

    res.status(200).json({
        success: true,
        count: articles.length,
        data: articles
    });
});


const publishArticle = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const article = await Article.findById(id);

    if (!article) {
        return next(new AppError('Article non trouvé', 404));
    }

    await article.publier();

    res.status(200).json({
        success: true,
        message: 'Article publié avec succès',
        data: article
    });
});

export {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    getPublishedArticles,
    publishArticle
};
