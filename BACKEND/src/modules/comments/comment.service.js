import { commentRepository } from './comment.repository.js';
import {
  NotFoundException,
  ForbiddenException,
} from '../../shared/exceptions/index.js';
import { postRepository } from '../posts/post.repository.js';

// A post whose comments/commenting are publicly available. Draft posts are
// treated as nonexistent to anyone here (we don't run optional auth on the
// public GET, and commenting requires the post to be live).
const assertPostIsVisible = async (postId) => {
  const post = await postRepository.findById(postId);
  // Unpublished (draft) posts are hidden — return 404, don't reveal existence.
  if (!post || !post.published) {
    throw new NotFoundException('Post not found.');
  }
  return post;
};

export const commentService = {
  createComment: async (userId, payload) => {
    // Post must exist AND be published to accept comments.
    await assertPostIsVisible(payload.postId);

    return commentRepository.create({
      content: payload.content,
      postId: payload.postId,
      userId,
    });
  },

  getCommentsForPost: async (postId) => {
    // Only expose a comment thread for a publicly visible post.
    await assertPostIsVisible(postId);
    return commentRepository.findByPostId(postId);
  },

  updateComment: async (commentId, user, payload) => {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundException('Comment not found.');
    }
    // Owner-only edit.
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
    // Owner OR admin may delete.
    if (comment.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You do not have permission to delete this comment.');
    }
    return commentRepository.delete(commentId);
  },
};