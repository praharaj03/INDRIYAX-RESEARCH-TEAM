import { catchAsync } from '../../shared/utils/catchAsync.js';
import { postService } from './post.service.js';

/**
 * @desc    Create a new blog post
 * @route   POST /api/v1/posts
 * @access  Private (Author, Admin)
 */
export const createPost = catchAsync(async (req, res, next) => {
  const post = await postService.createPost(req.user.id, req.body);
  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: post
  });
});

/**
 * @desc    Get all posts (Public sees published, privileged sees all)
 * @route   GET /api/v1/posts
 * @access  Public
 */
export const getPosts = catchAsync(async (req, res, next) => {
  const posts = await postService.getAllPosts(req.user ?? null);
  res.status(200).json({
    success: true,
    data: posts
  });
});

/**
 * @desc    Get a single post by slug
 * @route   GET /api/v1/posts/:slug
 * @access  Public
 */
export const getPost = catchAsync(async (req, res, next) => {
  const post = await postService.getPostBySlug(req.params.slug);
  res.status(200).json({
    success: true,
    data: post
  });
});

/**
 * @desc    Update a post by ID
 * @route   PATCH /api/v1/posts/:id
 * @access  Private (Author of the post, Admin)
 */
export const updatePost = catchAsync(async (req, res, next) => {
  const post = await postService.updatePost(req.params.id, req.user, req.body);
  res.status(200).json({
    success: true,
    message: 'Post updated successfully',
    data: post
  });
});

/**
 * @desc    Delete a post by ID
 * @route   DELETE /api/v1/posts/:id
 * @access  Private (Author of the post, Admin)
 */
export const deletePost = catchAsync(async (req, res, next) => {
  await postService.deletePost(req.params.id, req.user);
  res.status(200).json({
    success: true,
    message: 'Post deleted successfully'
  });
});