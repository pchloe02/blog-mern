import express from 'express';
const router = express.Router();

import { createComment, getAllComments, getCommentsByArticle, deleteComment, updateComment } from '../controllers/commentController.js';

router.post('/:articleId', createComment);
router.get('/', getAllComments);
router.get('/:articleId', getCommentsByArticle);
router.delete('/:id', deleteComment);
router.patch('/:id', updateComment);
export default router;