import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from './post.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createPostSchema, updatePostSchema } from './post.validator.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';
import { softAuth } from '../../middlewares/softAuth.middleware.js';

const router = Router();

// PUBLIC ROUTES
// softAuth = optional auth: attaches req.user IF a valid token is present, never
// blocks. Lets admins/authors see drafts here while anonymous users see only
// published posts.

// GET /api/v1/posts (Public list; privileged users additionally see drafts)
router.get('/', softAuth, getPosts);

// GET /api/v1/posts/:slug (Public single post; privileged users can view drafts)
router.get('/:slug', softAuth, getPost);

// PRIVILEGED ROUTES (AUTHORS & ADMINS ONLY)
router.use(protect, restrictTo('AUTHOR', 'ADMIN'));

// POST /api/v1/posts (Create)
router.post('/', validate(createPostSchema), createPost);

// PATCH /api/v1/posts/:id (Update)
router.patch('/:id', validate(updatePostSchema), updatePost);

// DELETE /api/v1/posts/:id (Delete)
router.delete('/:id', deletePost);

export default router;