import { Router } from 'express';
import { 
  createPost, 
  getPosts, 
  getPost, 
  updatePost, 
  deletePost 
} from './post.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createPostSchema, updatePostSchema } from './post.validator.js';
import { protect, restrictTo } from '../../middlewares/auth.middleware.js';

const router = Router();

// PUBLIC ROUTES


// GET /api/v1/posts (Public - Lists published posts; Admins/Authors see all)
router.get('/', getPosts);

// GET /api/v1/posts/:slug (Public - Get a single post by its slug)
router.get('/:slug', getPost);



// PRIVILEGED ROUTES (AUTHORS & ADMINS ONLY)

// Protect ensures they are logged in. restrictTo ensures they have the right role.
router.use(protect, restrictTo('AUTHOR', 'ADMIN'));

// POST /api/v1/posts (Authors/Admins - Create a new post)
router.post('/', validate(createPostSchema), createPost);

// PATCH /api/v1/posts/:id (Authors/Admins - Update a post)
router.patch('/:id', validate(updatePostSchema), updatePost);

// DELETE /api/v1/posts/:id (Authors/Admins - Delete a post)
router.delete('/:id', deletePost);

export default router;