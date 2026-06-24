import { Prisma } from '@prisma/client';
import { postRepository } from './post.repository.js';
import {
  NotFoundException,
  ConflictException,
  ForbiddenException,
  UnauthorizedException,
} from '../../shared/exceptions/index.js';

const generateSlug = (title) => {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomSuffix}`;
};

const isPrivileged = (user) =>
  !!user && (user.role === 'ADMIN' || user.role === 'AUTHOR');

// Can this requester see a DRAFT (unpublished) post? Privileged users, or the
// post's own author.
const canSeeDraft = (post, user) =>
  isPrivileged(user) || (!!user && post.authorId === user.id);

export const postService = {
  createPost: async (authorId, payload) => {
    const slug = generateSlug(payload.title);
    try {
      return await postRepository.create({ ...payload, slug, authorId });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException(
          'Could not generate a unique slug for this post. Please try again.'
        );
      }
      throw err;
    }
  },

  getAllPosts: async (user) => {
    // Public/users only see published posts; admins/authors see drafts too.
    const filters = isPrivileged(user) ? {} : { published: true };
    // The list returns metadata only (no body), so premium content is never
    // exposed here regardless of login state — no gating needed in the list.
    return postRepository.findAll(filters);
  },

  getPostBySlug: async (slug, user) => {
    const post = await postRepository.findBySlug(slug);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Drafts: invisible to anyone but privileged users / the author. Return 404
    // so we don't reveal that a draft slug is valid.
    if (!post.published && !canSeeDraft(post, user)) {
      throw new NotFoundException('Post not found');
    }

    // Premium rule: a premium post's body is for LOGGED-IN users only. Any
    // authenticated user qualifies (role doesn't matter). Anonymous → 401 so
    // the frontend can prompt sign-in. Non-premium posts are open to everyone.
    if (post.isPremium && !user) {
      throw new UnauthorizedException(
        'Please log in to read this premium article.'
      );
    }

    return post;
  },

  updatePost: async (id, user, payload) => {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (user.role !== 'ADMIN' && post.authorId !== user.id) {
      throw new ForbiddenException('You do not have permission to edit this post.');
    }
    return postRepository.update(id, payload);
  },

  deletePost: async (id, user) => {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (user.role !== 'ADMIN' && post.authorId !== user.id) {
      throw new ForbiddenException('You do not have permission to delete this post.');
    }
    return postRepository.delete(id);
  },
};