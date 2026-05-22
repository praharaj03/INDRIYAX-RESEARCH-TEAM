import { postRepository } from './post.repository.js';
import { NotFoundException, ConflictException, ForbiddenException } from '../../shared/exceptions/index.js';

const generateSlug = (title) => {
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomSuffix}`;
};

export const postService = {
  createPost: async (authorId, payload) => {
    const slug = generateSlug(payload.title);
    
    const existingPost = await postRepository.findBySlug(slug);
    if (existingPost) {
      throw new ConflictException('A post with this generated slug already exists. Please modify the title slightly.');
    }

    return postRepository.create({ ...payload, slug, authorId });
  },

  getAllPosts: async (user) => {
    // Public/Users only see published posts. Admins/Authors can see drafts too.
    const isPrivileged = user && ['ADMIN', 'AUTHOR'].includes(user.role);
    const filters = isPrivileged ? {} : { published: true };
    return postRepository.findAll(filters);
  },

  getPostBySlug: async (slug) => {
    const post = await postRepository.findBySlug(slug);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  },

  updatePost: async (id, user, payload) => {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Ownership check: Admin can update anything. Author can only update their own.
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

    // Ownership check
    if (user.role !== 'ADMIN' && post.authorId !== user.id) {
      throw new ForbiddenException('You do not have permission to delete this post.');
    }

    return postRepository.delete(id);
  }
};