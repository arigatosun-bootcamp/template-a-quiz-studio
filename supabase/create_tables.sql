-- =============================================
-- JapanMaster テーブル作成SQL
-- Supabase SQL Editor で実行してください
-- =============================================

-- 1. users テーブル（ユーザー情報）
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

comment on table public.users is 'ユーザー情報';

-- 2. quiz_sessions テーブル（クイズセッション: 1回のゲーム = 5問）
create table public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  genre text not null check (genre in ('geography', 'tourism', 'food')),
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  score int not null default 0 check (score >= 0 and score <= 5),
  played_at timestamptz not null default now()
);

comment on table public.quiz_sessions is 'クイズセッション（1回のゲーム = 5問）';

-- 3. quizzes テーブル（AI生成された各クイズ問題）
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.quiz_sessions(id) on delete cascade,
  question_text text not null,
  choice_1 text not null,
  choice_2 text not null,
  choice_3 text not null,
  correct_answer text not null,
  explanation text not null,
  genre text not null check (genre in ('geography', 'tourism', 'food')),
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  prefecture text not null,
  question_order int not null check (question_order >= 1 and question_order <= 5),
  created_at timestamptz not null default now()
);

comment on table public.quizzes is 'クイズ問題（AI生成された各問題）';

-- 4. answers テーブル（ユーザーの各問題への回答）
create table public.answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  selected_answer text not null,
  is_correct boolean not null,
  answered_at timestamptz not null default now()
);

comment on table public.answers is '回答履歴（ユーザーの各問題への回答）';

-- 5. prefecture_progress テーブル（都道府県の達成状況）
create table public.prefecture_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  prefecture text not null,
  max_difficulty text not null check (max_difficulty in ('beginner', 'intermediate', 'advanced')),
  updated_at timestamptz not null default now(),
  unique (user_id, prefecture)
);

comment on table public.prefecture_progress is '都道府県の達成状況（ユーザーごとの最高クリア難易度）';

-- =============================================
-- RLS（Row Level Security）を有効化
-- 他のユーザーのデータを見れないようにする
-- =============================================
alter table public.users enable row level security;
alter table public.quiz_sessions enable row level security;
alter table public.quizzes enable row level security;
alter table public.answers enable row level security;
alter table public.prefecture_progress enable row level security;

-- =============================================
-- RLSポリシー: 自分のデータのみアクセス可能
-- =============================================

-- users
create policy "Users can view own data" on public.users
  for select using (auth.uid() = id);
create policy "Users can insert own data" on public.users
  for insert with check (auth.uid() = id);

-- quiz_sessions
create policy "Users can view own sessions" on public.quiz_sessions
  for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on public.quiz_sessions
  for insert with check (auth.uid() = user_id);

-- quizzes
create policy "Users can view own quizzes" on public.quizzes
  for select using (
    exists (
      select 1 from public.quiz_sessions
      where quiz_sessions.id = quizzes.session_id
      and quiz_sessions.user_id = auth.uid()
    )
  );
create policy "Users can insert own quizzes" on public.quizzes
  for insert with check (
    exists (
      select 1 from public.quiz_sessions
      where quiz_sessions.id = quizzes.session_id
      and quiz_sessions.user_id = auth.uid()
    )
  );

-- answers
create policy "Users can view own answers" on public.answers
  for select using (auth.uid() = user_id);
create policy "Users can insert own answers" on public.answers
  for insert with check (auth.uid() = user_id);

-- prefecture_progress
create policy "Users can view own progress" on public.prefecture_progress
  for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.prefecture_progress
  for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.prefecture_progress
  for update using (auth.uid() = user_id);
