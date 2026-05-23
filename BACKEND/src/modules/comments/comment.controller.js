import { catchAsync } from '../../shared/utils/catchAsync.js';
import { commentService } from './comment.service.js';

/**
 * @desc    Get all comments for a specific post
 * @route   GET /api/v1/comments/post/:postId
 * @access  Public
 */
export const getComments = catchAsync(async (req, res, next) => {
  const comments = await commentService.getCommentsForPost(req.params.postId);
  res.status(200).json({
    success: true,
    data: comments
  });
});

/**
 * @desc    Create a new comment
 * @route   POST /api/v1/comments
 * @access  Private (Logged in users)
 */
export const createComment = catchAsync(async (req, res, next) => {
  const comment = await commentService.createComment(req.user.id, req.body);
  res.status(201).json({
    success: true,
    message: 'Comment posted successfully',
    data: comment
  });
});

/**
 * @desc    Update a comment
 * @route   PATCH /api/v1/comments/:id
 * @access  Private (Owner only)
 */
export const updateComment = catchAsync(async (req, res, next) => {
  const comment = await commentService.updateComment(req.params.id, req.user, req.body);
  res.status(200).json({
    success: true,
    message: 'Comment updated successfully',
    data: comment
  });
});

/**
 * @desc    Delete a comment
 * @route   DELETE /api/v1/comments/:id
 * @access  Private (Owner or Admin)
 */
export const deleteComment = catchAsync(async (req, res, next) => {
  await commentService.deleteComment(req.params.id, req.user);
  res.status(200).json({
    success: true,
    message: 'Comment deleted successfully'
  });
});