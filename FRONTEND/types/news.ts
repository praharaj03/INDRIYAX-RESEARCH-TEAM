export interface News {
  id: string;
  slug: string;
  title: string;
  content: string;
  tags: string[];
  coverImage?: string;
  author?: {
    id: string;
    fullName: string;
    imageUrl?: string;
  };
  createdAt: string;
  // legacy compat
  description?: string;
  link?: string;
  image?: string;
}
