import express from 'express';
const router = express.Router();

import {
        createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    getPublishedArticles,
    publishArticle
} from '../controllers/articleController.js';

router.get('/publies', getPublishedArticles);
router.get('/', getAllArticles);
router.post('/', createArticle);
router.get('/:id', getArticleById);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);
router.patch('/:id/publier', publishArticle);

export default router;
