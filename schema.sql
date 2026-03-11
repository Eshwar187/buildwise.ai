-- Supabase Schema for BuildWise AI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE (Extends Supabase Auth Users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  status TEXT DEFAULT 'Planning',
  client_name TEXT,
  budget DECIMAL,
  start_date DATE,
  completion_date DATE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- FLOOR PLANS TABLE
CREATE TABLE IF NOT EXISTS public.floor_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- MATERIALS TABLE
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL NOT NULL,
  supplier TEXT,
  sustainability_rating TEXT,
  eco_friendly BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- REGIONS TABLE
CREATE TABLE IF NOT EXISTS public.regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- INVENTORY TABLE (Global material catalog)
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  unit_price DECIMAL NOT NULL,
  stock_quantity DECIMAL NOT NULL,
  low_stock_threshold DECIMAL NOT NULL,
  supplier TEXT,
  eco_friendly BOOLEAN DEFAULT false,
  sustainability_rating TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- TRIGGER FOR NEW USERS (Automatically insert into public.users when auth.users is created)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.floor_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "Users can view own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- Projects policies (users manage their own projects)
CREATE POLICY "Users can view own projects" 
  ON public.projects FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" 
  ON public.projects FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" 
  ON public.projects FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" 
  ON public.projects FOR DELETE 
  USING (auth.uid() = user_id);

-- Floor plans inherit project access
CREATE POLICY "Users can view floor plans for their projects" 
  ON public.floor_plans FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = floor_plans.project_id AND user_id = auth.uid()));

CREATE POLICY "Users can insert floor plans for their projects" 
  ON public.floor_plans FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = floor_plans.project_id AND user_id = auth.uid()));

CREATE POLICY "Users can update floor plans for their projects" 
  ON public.floor_plans FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = floor_plans.project_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete floor plans for their projects" 
  ON public.floor_plans FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = floor_plans.project_id AND user_id = auth.uid()));

-- Materials inherit project access (or global if project_id is null)
CREATE POLICY "Users can view materials" 
  ON public.materials FOR SELECT 
  USING (project_id IS NULL OR EXISTS (SELECT 1 FROM public.projects WHERE id = materials.project_id AND user_id = auth.uid()));

CREATE POLICY "Users can generate materials" 
  ON public.materials FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.projects WHERE id = materials.project_id AND user_id = auth.uid()));

CREATE POLICY "Users can update materials" 
  ON public.materials FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = materials.project_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete materials" 
  ON public.materials FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.projects WHERE id = materials.project_id AND user_id = auth.uid()));

-- Reference data (regions, inventory) can be read by authenticated users
CREATE POLICY "Authenticated users can read regions" 
  ON public.regions FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can read inventory" 
  ON public.inventory FOR SELECT 
  TO authenticated USING (true);
