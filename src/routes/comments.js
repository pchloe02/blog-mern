import express from 'express';
const router = express.Router();

import { createComment, getAllComments, getCommentsByArticle, deleteComment } from '../controllers/commentController.js';

router.post('/:articleId', createComment);
router.get('/', getAllComments);
router.get('/:articleId', getCommentsByArticle);
router.delete('/:id', deleteComment);
export default router;