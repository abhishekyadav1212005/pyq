-- Supabase PostgreSQL Schema for PhysioPrep

-- 1. Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profile Table (linked to Supabase Auth users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    college TEXT,
    graduation_year INT,
    target_exams TEXT[], -- e.g. ['AIIMS', 'ESIC']
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    streak_count INT DEFAULT 0,
    last_active_date DATE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read-access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow users to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Create Exams Table
CREATE TABLE public.exams (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL, -- e.g. AIIMS, ESIC, DSSSB, RRB, NORCET, NHM
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Subjects Table
CREATE TABLE public.subjects (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL, -- e.g. Anatomy, Physiology, Electrotherapy, Kinesiology
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Topics Table
CREATE TABLE public.topics (
    id SERIAL PRIMARY KEY,
    subject_id INT REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g. Shoulder Joint, Shortwave Diathermy, Nerve Injuries
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(subject_id, name)
);

-- 6. Create Questions Table
CREATE TABLE public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id INT REFERENCES public.exams(id) ON DELETE SET NULL,
    subject_id INT REFERENCES public.subjects(id) ON DELETE SET NULL,
    topic_id INT REFERENCES public.topics(id) ON DELETE SET NULL,
    year INT, -- PYQ Year
    question_text TEXT NOT NULL,
    image_url TEXT,
    explanation TEXT,
    reference_book TEXT,
    difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) DEFAULT 'Medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 7. Create Options Table
CREATE TABLE public.options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false NOT NULL
);

-- 8. Create Attempts Table (individual question practice)
CREATE TABLE public.attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
    selected_option_id UUID REFERENCES public.options(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Create Bookmarks Table
CREATE TABLE public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, question_id)
);

-- 10. Create Mock Tests Table
CREATE TABLE public.mock_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INT DEFAULT 60 NOT NULL,
    total_questions INT NOT NULL,
    positive_marks NUMERIC(4,2) DEFAULT 1.00 NOT NULL,
    negative_marks NUMERIC(4,2) DEFAULT 0.25 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Create Mock Test Questions mapping
CREATE TABLE public.mock_test_questions (
    mock_test_id UUID REFERENCES public.mock_tests(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    question_order INT,
    PRIMARY KEY (mock_test_id, question_id)
);

-- 12. Create Test Results Table (results of mock test)
CREATE TABLE public.test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mock_test_id UUID REFERENCES public.mock_tests(id) ON DELETE CASCADE NOT NULL,
    score NUMERIC(5,2) NOT NULL,
    accuracy NUMERIC(5,2) NOT NULL,
    time_spent_seconds INT NOT NULL,
    correct_count INT NOT NULL,
    incorrect_count INT NOT NULL,
    unattempted_count INT NOT NULL,
    percentile NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Create Achievements Table
CREATE TABLE public.achievements (
    id TEXT PRIMARY KEY, -- e.g. 'streak_7', 'anatomy_master'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    badge_icon TEXT NOT NULL, -- Name of Lucide Icon or url
    xp_reward INT DEFAULT 100
);

-- 14. Create User Achievements mapping
CREATE TABLE public.user_achievements (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id TEXT REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, achievement_id)
);

-- 15. Create Discussions Table (For question discussion threads)
CREATE TABLE public.discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    upvotes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 16. Create Comments Table (For comments on discussions)
CREATE TABLE public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    upvotes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 17. Create Notifications Table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('streak', 'exam', 'reminder', 'system')) NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Initial Achievements
INSERT INTO public.achievements (id, title, description, badge_icon, xp_reward) VALUES
('streak_3', 'Streak Beginner', 'Maintain a study streak for 3 consecutive days', 'Flame', 50),
('streak_7', 'Streak Master', 'Maintain a study streak for 7 consecutive days', 'Flame', 150),
('first_mock', 'Exam Taker', 'Complete your first full-length Mock Test', 'Award', 100),
('accuracy_90', 'Sniper', 'Achieve over 90% accuracy in a practice session of 20+ questions', 'Target', 200),
('anatomy_ace', 'Anatomy Ace', 'Solve 50 Anatomy questions correctly', 'ShieldAlert', 100),
('xp_1000', 'XP Collector', 'Amass 1,000 total XP points', 'Zap', 250);
