import Comment from "../models/Comment.js";
import QueryFeatures from '../utils/queryFeatures.js';
import AppError from '../utils/AppError.js';
import { catchAsync } from '../middleware/errorHandler.js';

const createComment = catchAsync(async (req, res, next) => {
    const { articleId } = req.params;
    const { content, author, email } = req.body;

    if (!articleId) {
        return next(new AppError('Article manquant', 400));
    }

    if (!content || content.trim() === "") {
        return next(new AppError("Le contenu du commentaire est requis", 400));
    }

    const comment = new Comment({
        content,
        author,
        email,
        article: articleId
    });

    await comment.save();

    res.status(201).json({
        status: 'success',
        data: {
            comment,
            message: `Commentaire ${comment.id} créé avec succès`
        }
    });
});


const getAllComments = catchAsync(async (req, res, next) => {
    const totalCount = await Comment.countDocuments();
    const features = new QueryFeatures(Comment.find(), req.query)
        .filter()
        .search()
        .sort()
        .limitFields()
        .paginate();


    const comments = await features.query;

    const paginationInfo = features.getPaginationInfo(totalCount);

    const response = {
        success: true,
        count: comments.length,
        totalCount: totalCount,
        data: comments
    };

    if (paginationInfo) {
        response.pagination = paginationInfo;
    }

    res.status(200).json(response);
})

const getCommentsByArticle = catchAsync(async (req, res, next) => {
    const { articleId } = req.params;
    if (!articleId) {
        return next(new AppError('Article manquant', 400));
    }
    const comments = await Comment.find({ article: articleId });
    res.status(200).json({
        status: 'success',
        results: comments.length,
        data: {
            comments
        }
    });
});

const deleteComment = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
        return next(new AppError('Commentaire non trouvé', 404));
    }
    res.status(204).json({
        status: 'success',
        data: {
            message: `Commentaire ${id} supprimé avec succès`
        }
    });
});

export { createComment, getAllComments, getCommentsByArticle, deleteComment }