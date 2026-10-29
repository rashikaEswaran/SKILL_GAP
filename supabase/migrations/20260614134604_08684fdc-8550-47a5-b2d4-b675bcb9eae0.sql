
-- ROLES
CREATE TYPE public.app_role AS ENUM ('student', 'faculty', 'placement_officer', 'admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  college TEXT,
  department TEXT,
  academic_year TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile + default student role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- INDUSTRY SKILLS CATALOG
CREATE TABLE public.industry_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  demand_score INT NOT NULL DEFAULT 50,
  growth_rate NUMERIC NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.industry_skills TO authenticated, anon;
GRANT ALL ON public.industry_skills TO service_role;
ALTER TABLE public.industry_skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads industry skills" ON public.industry_skills FOR SELECT TO authenticated, anon USING (true);

INSERT INTO public.industry_skills (name, category, demand_score, growth_rate, description) VALUES
('Python', 'Programming', 95, 12.5, 'General-purpose programming language'),
('JavaScript', 'Programming', 93, 8.2, 'Web programming language'),
('TypeScript', 'Programming', 88, 18.4, 'Typed JavaScript superset'),
('React', 'Frontend', 90, 14.0, 'UI library'),
('Node.js', 'Backend', 85, 9.5, 'JavaScript runtime'),
('SQL', 'Database', 92, 5.0, 'Relational query language'),
('PostgreSQL', 'Database', 80, 11.0, 'Open-source relational DB'),
('MongoDB', 'Database', 72, 7.0, 'NoSQL document DB'),
('Docker', 'DevOps', 86, 13.0, 'Containerization'),
('Kubernetes', 'DevOps', 78, 17.5, 'Container orchestration'),
('AWS', 'Cloud', 91, 15.0, 'Amazon cloud platform'),
('Azure', 'Cloud', 80, 14.0, 'Microsoft cloud platform'),
('Git', 'Tools', 95, 3.0, 'Version control'),
('Machine Learning', 'AI', 89, 22.0, 'ML algorithms and modeling'),
('Deep Learning', 'AI', 82, 25.0, 'Neural networks'),
('TensorFlow', 'AI', 75, 12.0, 'ML framework'),
('PyTorch', 'AI', 78, 19.0, 'ML framework'),
('Data Analysis', 'Data', 85, 11.0, 'Analytical reasoning with data'),
('Pandas', 'Data', 78, 9.0, 'Python data analysis library'),
('NumPy', 'Data', 75, 6.0, 'Numerical computing'),
('Java', 'Programming', 82, 2.0, 'OOP language'),
('C++', 'Programming', 70, 1.5, 'Systems programming'),
('Go', 'Programming', 68, 16.0, 'Concurrent backend language'),
('Rust', 'Programming', 60, 24.0, 'Systems programming'),
('GraphQL', 'API', 70, 13.0, 'API query language'),
('REST APIs', 'API', 88, 4.0, 'HTTP API style'),
('System Design', 'Engineering', 87, 10.0, 'Designing large-scale systems'),
('Data Structures', 'CS Fundamentals', 95, 2.0, 'Core CS knowledge'),
('Algorithms', 'CS Fundamentals', 95, 2.0, 'Core CS knowledge'),
('Communication', 'Soft Skills', 90, 4.0, 'Verbal and written communication'),
('Problem Solving', 'Soft Skills', 93, 4.0, 'Analytical thinking'),
('Teamwork', 'Soft Skills', 88, 3.0, 'Collaboration'),
('Leadership', 'Soft Skills', 75, 5.0, 'Leading teams and initiatives'),
('Linux', 'Tools', 80, 4.0, 'Operating system'),
('CI/CD', 'DevOps', 82, 11.0, 'Continuous integration/deployment'),
('Tailwind CSS', 'Frontend', 78, 22.0, 'Utility-first CSS'),
('Next.js', 'Frontend', 82, 20.0, 'React framework'),
('FastAPI', 'Backend', 70, 25.0, 'Python web framework'),
('Spring Boot', 'Backend', 75, 5.0, 'Java framework'),
('Cybersecurity', 'Security', 88, 18.0, 'Security practices and tools');

-- ANALYSES
CREATE TABLE public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Skill Gap Analysis',
  target_role TEXT,
  input_text TEXT,
  extracted_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  matched_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  courses JSONB NOT NULL DEFAULT '[]'::jsonb,
  gap_score NUMERIC NOT NULL DEFAULT 0,
  readiness_score NUMERIC NOT NULL DEFAULT 0,
  industry_match NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analyses TO authenticated;
GRANT ALL ON public.analyses TO service_role;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own analyses" ON public.analyses FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX analyses_user_idx ON public.analyses(user_id, created_at DESC);
