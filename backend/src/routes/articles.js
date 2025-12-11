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
import { protect } from '../middleware/auth.js';

router.get('/published', getPublishedArticles);
router.get('/', getAllArticles);
router.get('/:id', getArticleById);

router.use(protect);
router.post('/', createArticle);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);
router.patch('/:id/publish', publishArticle);

export default router;
