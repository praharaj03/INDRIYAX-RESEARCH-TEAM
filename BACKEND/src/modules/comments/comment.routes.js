import { Router } from 'express';
import { 
  getComments, 
  createComment, 
  updateComment, 
  deleteComment 
} from './comment.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createCommentSchema, updateCommentSchema } from './comment.validator.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = Router();


// PUBLIC ROUTES


// GET /api/v1/comments/post/:postId (Get all comments for a post)
router.get('/post/:postId', getComments);

// ==========================================
// PROTECTED ROUTES (LOGGED IN USERS)
// ==========================================
router.use(protect);

// POST /api/v1/comments (Create a comment)
router.post('/', validate(createCommentSchema), createComment);

// PATCH /api/v1/comments/:id (Edit your comment)
router.patch('/:id', validate(updateCommentSchema), updateComment);

// DELETE /api/v1/comments/:id (Delete a comment - Admin or Owner)
router.delete('/:id', deleteComment);

export default router;