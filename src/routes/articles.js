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
import { verifyToken } from '../middleware/auth.js';

router.get('/published', getPublishedArticles);
router.get('/', getAllArticles);
router.get('/:id', getArticleById);

router.post('/', verifyToken, createArticle);
router.put('/:id', verifyToken, updateArticle);
router.delete('/:id', verifyToken, deleteArticle);
router.patch('/:id/publish', verifyToken, publishArticle);

export default router;
