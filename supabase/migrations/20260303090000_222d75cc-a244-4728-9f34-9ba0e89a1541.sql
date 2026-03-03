
-- Create app roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'writer', 'user');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_suspended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#8B5CF6',
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tags table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Posts table
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  is_featured BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  reading_time INT DEFAULT 0,
  views INT DEFAULT 0,
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Post tags junction
CREATE TABLE public.post_tags (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Quotes table
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT DEFAULT 'motivational',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- News table
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  category TEXT DEFAULT 'tech',
  is_breaking BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT DEFAULT 'knowledge',
  time_limit INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Quiz questions
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer INT NOT NULL DEFAULT 0,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Quiz results
CREATE TABLE public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score INT NOT NULL DEFAULT 0,
  total_questions INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Web stories
CREATE TABLE public.web_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  thumbnail TEXT,
  slides JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Analytics events
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Check if user has any admin/editor/writer role
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'editor', 'writer')
  )
$$;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_web_stories_updated_at BEFORE UPDATE ON public.web_stories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Profiles: everyone can read, users update own
CREATE POLICY "Public profiles readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- User roles: staff can read all, admin can manage
CREATE POLICY "Staff can read roles" ON public.user_roles FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "Admin manages roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Categories: public read, staff manage
CREATE POLICY "Public categories readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Staff manage categories" ON public.categories FOR ALL USING (public.is_staff(auth.uid()));

-- Tags: public read, staff manage
CREATE POLICY "Public tags readable" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Staff manage tags" ON public.tags FOR ALL USING (public.is_staff(auth.uid()));

-- Posts: public read published, staff manage
CREATE POLICY "Public read published posts" ON public.posts FOR SELECT USING (status = 'published' OR public.is_staff(auth.uid()));
CREATE POLICY "Staff manage posts" ON public.posts FOR INSERT WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update posts" ON public.posts FOR UPDATE USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete posts" ON public.posts FOR DELETE USING (public.is_staff(auth.uid()));

-- Post tags: public read, staff manage
CREATE POLICY "Public read post tags" ON public.post_tags FOR SELECT USING (true);
CREATE POLICY "Staff manage post tags" ON public.post_tags FOR ALL USING (public.is_staff(auth.uid()));

-- Comments: public read approved, users create own, staff moderate
CREATE POLICY "Public read approved comments" ON public.comments FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY "Users create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Staff moderate comments" ON public.comments FOR UPDATE USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete comments" ON public.comments FOR DELETE USING (public.is_staff(auth.uid()));

-- Quotes: public read, staff manage
CREATE POLICY "Public read quotes" ON public.quotes FOR SELECT USING (true);
CREATE POLICY "Staff manage quotes" ON public.quotes FOR ALL USING (public.is_staff(auth.uid()));

-- News: public read published, staff manage
CREATE POLICY "Public read published news" ON public.news FOR SELECT USING (status = 'published' OR public.is_staff(auth.uid()));
CREATE POLICY "Staff manage news" ON public.news FOR INSERT WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update news" ON public.news FOR UPDATE USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete news" ON public.news FOR DELETE USING (public.is_staff(auth.uid()));

-- Quizzes: public read active, staff manage
CREATE POLICY "Public read active quizzes" ON public.quizzes FOR SELECT USING (is_active = true OR public.is_staff(auth.uid()));
CREATE POLICY "Staff manage quizzes" ON public.quizzes FOR ALL USING (public.is_staff(auth.uid()));

-- Quiz questions: public read, staff manage
CREATE POLICY "Public read quiz questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Staff manage quiz questions" ON public.quiz_questions FOR ALL USING (public.is_staff(auth.uid()));

-- Quiz results: users read own, staff read all
CREATE POLICY "Users read own results" ON public.quiz_results FOR SELECT USING (auth.uid() = user_id OR public.is_staff(auth.uid()));
CREATE POLICY "Users create own results" ON public.quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Web stories: public read active, staff manage
CREATE POLICY "Public read active stories" ON public.web_stories FOR SELECT USING (is_active = true OR public.is_staff(auth.uid()));
CREATE POLICY "Staff manage stories" ON public.web_stories FOR ALL USING (public.is_staff(auth.uid()));

-- Analytics: staff read, system insert
CREATE POLICY "Staff read analytics" ON public.analytics_events FOR SELECT USING (public.is_staff(auth.uid()));
CREATE POLICY "Anyone insert analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);
