import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type PublishedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  reading_time: number | null;
  is_featured: boolean | null;
  published_at: string | null;
  views: number | null;
  author_id: string | null;
  categories: { name: string; slug: string; color: string | null } | null;
};

type PostsFetchOptions = {
  featuredOnly?: boolean;
  limit?: number;
  categorySlug?: string;
  sort?: 'latest' | 'popular';
};

async function fetchPublishedPosts(options: PostsFetchOptions = {}) {
  const { featuredOnly = false, limit = 12, categorySlug, sort = 'latest' } = options;

  const select = categorySlug
    ? 'id, title, slug, excerpt, content, featured_image, reading_time, is_featured, published_at, views, author_id, categories!inner ( name, slug, color )'
    : 'id, title, slug, excerpt, content, featured_image, reading_time, is_featured, published_at, views, author_id, categories ( name, slug, color )';

  let query = supabase
    .from('posts')
    .select(select)
    .eq('status', 'published')
    .limit(limit);

  if (featuredOnly) query = query.eq('is_featured', true);
  if (categorySlug) query = query.eq('categories.slug', categorySlug);

  query =
    sort === 'popular'
      ? query.order('views', { ascending: false })
      : query.order('published_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as PublishedPost[];
}

async function fetchPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, title, slug, excerpt, content, featured_image, reading_time, is_featured, published_at, views, author_id, categories ( name, slug, color )',
    )
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data as PublishedPost | null;
}

async function fetchAuthorNames(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, string>();

  const { data } = await supabase
    .from('profiles')
    .select('user_id, display_name')
    .in('user_id', userIds);

  const map = new Map<string, string>();
  for (const row of data ?? []) {
    if (row.display_name) map.set(row.user_id, row.display_name);
  }
  return map;
}

export function usePublishedPosts(options?: PostsFetchOptions) {
  const featuredOnly = options?.featuredOnly ?? false;
  const limit = options?.limit ?? 12;
  const categorySlug = options?.categorySlug;
  const sort = options?.sort ?? 'latest';

  return useQuery({
    queryKey: ['published-posts', featuredOnly, limit, categorySlug, sort],
    queryFn: async () => {
      const posts = await fetchPublishedPosts({ featuredOnly, limit, categorySlug, sort });
      const authorIds = [...new Set(posts.map(p => p.author_id).filter(Boolean))] as string[];
      const authors = await fetchAuthorNames(authorIds);
      return posts.map(post => ({
        ...post,
        authorName: post.author_id ? authors.get(post.author_id) ?? 'Script Safari' : 'Script Safari',
      }));
    },
  });
}

export function usePostBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['post', slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const post = await fetchPostBySlug(slug!);
      if (!post) return null;

      const authors = post.author_id
        ? await fetchAuthorNames([post.author_id])
        : new Map<string, string>();

      return {
        ...post,
        authorName: post.author_id
          ? authors.get(post.author_id) ?? 'Script Safari'
          : 'Script Safari',
      };
    },
  });
}

export function usePublishedNews(options?: { limit?: number; category?: string }) {
  const limit = options?.limit ?? 50;
  const category = options?.category;

  return useQuery({
    queryKey: ['published-news', limit, category],
    queryFn: async () => {
      let query = supabase
        .from('news')
        .select('id, title, slug, content, is_breaking, category, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit);

      if (category) query = query.eq('category', category);

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

async function fetchNewsBySlug(slug: string) {
  const { data, error } = await supabase
    .from('news')
    .select('id, title, slug, content, category, is_breaking, published_at')
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export function useNewsBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['news', slug],
    enabled: Boolean(slug),
    queryFn: () => fetchNewsBySlug(slug!),
  });
}

export function useQuotes(options?: { limit?: number; category?: string }) {
  const limit = options?.limit ?? 50;
  const category = options?.category;

  return useQuery({
    queryKey: ['quotes', limit, category],
    queryFn: async () => {
      let query = supabase
        .from('quotes')
        .select('id, text, author, category, is_featured')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (category) query = query.eq('category', category);

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useActiveStories(limit = 50) {
  return useQuery({
    queryKey: ['web-stories', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('web_stories')
        .select('id, title, thumbnail, slides')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useActiveQuizzes(options?: { limit?: number; category?: string }) {
  const limit = options?.limit ?? 50;
  const category = options?.category;

  return useQuery({
    queryKey: ['quizzes', limit, category],
    queryFn: async () => {
      let query = supabase
        .from('quizzes')
        .select('id, title, slug, description, category')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (category) query = query.eq('category', category);

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}
