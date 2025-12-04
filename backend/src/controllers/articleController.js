import Article from '../models/Article.js';
import QueryFeatures from '../utils/queryFeatures.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../middleware/errorHandler.js';



const createArticle = catchAsync(async (req, res, next) => {
    const { titre, contenu, categorie } = req.body;
    const article = new Article({
        titre,
        contenu,
        auteur: req.user._id,
        categorie
    });

    const articleSaved = await article.save();
    res.status(201).json({
        success: true,
        message: 'Article created successfully',
        data: articleSaved
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

    const articles = await features.query.populate('auteur', 'name');

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
    const article = await Article.findById(id).populate('auteur', 'name');
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
    const article = await Article.findById(id);
    if (!article) {
        return next(new AppError('Article non trouvé', 404));
    }

    if (article.auteur.toString() !== req.user._id.toString()) {
        return next(new AppError("You are not authorized to update this article", 403));
    }

    const allowedFields = ['titre', 'contenu', 'categorie'];
    allowedFields.forEach(field => {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
            article[field] = req.body[field];
        }
    });

    const updated = await article.save();

    res.status(200).json({
        success: true,
        message: 'Article has been updated successfully',
        data: updated
    });
});

const deleteArticle = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
        return next(new AppError('Article non trouvé', 404));
    }

    if (article.auteur.toString() !== req.user._id.toString()) {
        return next(new AppError("You are not authorized to delete this article", 403));
    }

    await article.remove();

    res.status(200).json({
        success: true,
        message: 'Article deleted successfully',
        data: article
    });
});
const getPublishedArticles = catchAsync(async (req, res, next) => {
    const articles = await Article.findPublished();

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

    if (article.auteur.toString() !== req.user._id.toString()) {
        return next(new AppError("You are not authorized to publish this article", 403));
    }

    await article.publish();

    res.status(200).json({
        success: true,
        message: 'Article published successfully',
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
