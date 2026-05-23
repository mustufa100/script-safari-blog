import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User } from 'lucide-react';
import PublicLayout from '@/components/PublicLayout';
import { usePostBySlug } from '@/hooks/usePublicContent';
import { DEFAULT_POST_IMAGE } from '@/lib/placeholders';

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = usePostBySlug(slug);

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to articles
        </Link>

        {isLoading && (
          <p className="text-center text-muted-foreground py-24 animate-pulse">Loading article...</p>
        )}

        {isError && (
          <p className="text-center text-destructive py-24">Could not load this article.</p>
        )}

        {!isLoading && !isError && !post && (
          <div className="glass-strong rounded-2xl p-12 text-center">
            <h1 className="font-display text-2xl font-bold">Article not found</h1>
            <p className="text-muted-foreground mt-2">It may be unpublished or removed.</p>
          </div>
        )}

        {post && (
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="rounded-2xl overflow-hidden mb-8">
              <img
                src={post.featured_image || DEFAULT_POST_IMAGE}
                alt={post.title}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {post.categories?.name && (
              <span
                className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4"
                style={{
                  backgroundColor: `${post.categories.color ?? '#8B5CF6'}33`,
                  color: post.categories.color ?? '#8B5CF6',
                }}
              >
                {post.categories.name}
              </span>
            )}

            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" /> {post.authorName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {post.reading_time ?? 1} min read
              </span>
            </div>

            {post.excerpt && (
              <p className="text-lg text-muted-foreground mb-8 border-l-4 border-primary pl-4">
                {post.excerpt}
              </p>
            )}

            <div className="prose prose-invert max-w-none">
              {(post.content || '')
                .split('\n')
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i} className="text-foreground/90 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
            </div>
          </motion.article>
        )}
      </div>
    </PublicLayout>
  );
};

export default PostDetail;
