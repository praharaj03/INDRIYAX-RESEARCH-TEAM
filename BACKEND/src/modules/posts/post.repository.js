import prisma from '../../config/prisma.config.js';

const AUTHOR_PUBLIC_SELECT = { id: true, fullName: true, imageUrl: true };

// LIST: metadata only — no `content`. A feed shows title/excerpt/cover, not the
// full body, so premium articles are never served in bulk and the list stays
// lightweight. Readers fetch the body via GET /:slug, where the premium gate
// applies.
const POST_LIST_SELECT = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImage: true,
  published: true,
  isPremium: true,
  tags: true,
  authorId: true,
  author: { select: AUTHOR_PUBLIC_SELECT },
  createdAt: true,
  updatedAt: true,
};

// DETAIL: full record including `content`. The service enforces the login gate
// for premium posts before this is returned.
const POST_DETAIL_SELECT = {
  id: true,
  slug: true,
  title: true,
  content: true,
  excerpt: true,
  coverImage: true,
  published: true,
  isPremium: true,
  tags: true,
  authorId: true,
  author: { select: AUTHOR_PUBLIC_SELECT },
  createdAt: true,
  updatedAt: true,
};

export const postRepository = {
  create: async (data) => {
    return prisma.post.create({ data });
  },

  findAll: async (filters = {}) => {
    return prisma.post.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      select: POST_LIST_SELECT,
    });
  },

  findBySlug: async (slug) => {
    return prisma.post.findUnique({
      where: { slug },
      select: POST_DETAIL_SELECT,
    });
  },

  // Lean select — only what the ownership/visibility checks need.
  findById: async (id) => {
    return prisma.post.findUnique({
      where: { id },
      select: { id: true, authorId: true, published: true, isPremium: true },
    });
  },

  update: async (id, data) => {
    return prisma.post.update({
      where: { id },
      data,
      select: POST_DETAIL_SELECT,
    });
  },

  delete: async (id) => {
    return prisma.post.delete({ where: { id } });
  },
};