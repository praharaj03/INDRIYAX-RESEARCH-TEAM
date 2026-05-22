import { commentRepository } from './comment.repository.js';
import { NotFoundException, ForbiddenException } from '../../shared/exceptions/index.js';
// Reusing postRepository to verify the post exists
import { postRepository } from '../posts/post.repository.js'; 

export const commentService = {
  createComment: async (userId, payload) => {
    // 1. Verify the post exists
    const post = await postRepository.findById(payload.postId);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    // 2. Create the comment
    return commentRepository.create({
      content: payload.content,
      postId: payload.postId,
      userId: userId
    });
  },

  getCommentsForPost: async (postId) => {
    return commentRepository.findByPostId(postId);
  },

  updateComment: async (commentId, user, payload) => {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    // 1. Ownership Check: Only the author of the comment can edit it
    if (comment.userId !== user.id) {
      throw new ForbiddenException('You can only edit your own comments.');
    }

    return commentRepository.update(commentId, payload.content);
  },

  deleteComment: async (commentId, user) => {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }

    // 1. Moderation Check: Author can delete their own, Admin can delete ANY comment
    if (comment.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to delete this comment.');
    }

    return commentRepository.delete(commentId);
  }
};