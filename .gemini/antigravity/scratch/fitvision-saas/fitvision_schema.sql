-- ============================================================
-- FITVISION SAAS — Schema SQL Completo
-- Cole este arquivo no Supabase > SQL Editor e execute
-- ============================================================

-- ============================================================
-- 1. EXTENSÕES
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 2. TABELA: profiles
-- Vincula auth.users ao tipo de conta (trainer/client)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role        TEXT NOT NULL CHECK (role IN ('trainer', 'client')),
    full_name   TEXT NOT NULL,
    email       TEXT NOT NULL,
    phone       TEXT,
    avatar_url  TEXT,
    trainer_id  UUID REFERENCES profiles(id) ON DELETE SET NULL, -- aluno vinculado ao personal
    status      TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'prospect')),
    is_prospect BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. TABELA: anamnesis
-- Ficha de anamnese do aluno (preenchida pelo aluno no onboarding)
-- ============================================================
CREATE TABLE IF NOT EXISTS anamnesis (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

    -- Dados básicos
    birth_date          TEXT,
    weight              NUMERIC(5,1),
    height              INTEGER,
    goal                TEXT,

    -- Anamnese reativa
    injuries            TEXT[] DEFAULT '{}',
    other_injury_details TEXT,
    had_surgery         BOOLEAN DEFAULT FALSE,
    surgery_details     TEXT,
    surgery_time        TEXT,

    -- Estilo de vida
    training_days       TEXT,
    muscle_difficulty   TEXT,
    cardio_frequency    TEXT,
    alcohol             TEXT,
    smoke               TEXT,
    diet_rating         TEXT,

    -- Fotos (URLs do Supabase Storage)
    photo_front         TEXT,
    photo_back          TEXT,
    photo_right         TEXT,
    photo_left          TEXT,

    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 4. TABELA: exercises
-- Banco de exercícios (criados pelo personal)
-- ============================================================
CREATE TABLE IF NOT EXISTS exercises (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    muscle_group    TEXT,
    equipment       TEXT,
    difficulty      TEXT CHECK (difficulty IN ('Iniciante', 'Intermediário', 'Avançado')),
    video_url       TEXT,
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. TABELA: workout_plans
-- Planos de treino criados pelo personal para um aluno
-- ============================================================
CREATE TABLE IF NOT EXISTS workout_plans (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    trainer_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    description TEXT,
    status      TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'locked')),
    paid        BOOLEAN DEFAULT FALSE, -- true = treino liberado ao aluno
    expires_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 6. TABELA: workout_days
-- Divisões de treino dentro de um plano (Treino A, B, C, D)
-- ============================================================
CREATE TABLE IF NOT EXISTS workout_days (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id         UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
    letter          TEXT NOT NULL,  -- 'A', 'B', 'C', 'D'
    title           TEXT,           -- 'Peito e Tríceps'
    focus           TEXT,           -- descrição do foco
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. TABELA: workout_exercises
-- Exercícios dentro de cada divisão de treino
-- ============================================================
CREATE TABLE IF NOT EXISTS workout_exercises (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_id                  UUID NOT NULL REFERENCES workout_days(id) ON DELETE CASCADE,
    exercise_id             UUID REFERENCES exercises(id) ON DELETE SET NULL,
    exercise_name           TEXT NOT NULL, -- nome salvo na criação (mesmo se exercise for deletado)
    muscle_group            TEXT,
    sets                    INTEGER DEFAULT 3,
    reps                    TEXT DEFAULT '12',  -- pode ser '12' ou '8-12'
    rest_seconds            INTEGER DEFAULT 60,
    professional_observation TEXT,
    sort_order              INTEGER DEFAULT 0,
    created_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. TABELA: workout_logs
-- Registro de execução do aluno (cargas e séries realizadas)
-- ============================================================
CREATE TABLE IF NOT EXISTS workout_logs (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    workout_exercise_id UUID NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
    set_index           INTEGER NOT NULL,
    reps_done           TEXT,
    load_kg             NUMERIC(6,1),
    completed           BOOLEAN DEFAULT FALSE,
    logged_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- Garante que cada usuário só acessa seus próprios dados
-- ============================================================

ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnesis        ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises        ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans    ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_days     ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs     ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Usuário vê seu próprio perfil"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Personal vê perfis dos seus alunos"
    ON profiles FOR SELECT
    USING (trainer_id = auth.uid());

CREATE POLICY "Usuário atualiza seu próprio perfil"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Inserir próprio perfil"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ANAMNESIS
CREATE POLICY "Aluno vê sua anamnese"
    ON anamnesis FOR SELECT
    USING (client_id = auth.uid());

CREATE POLICY "Personal vê anamnese dos seus alunos"
    ON anamnesis FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = anamnesis.client_id
            AND profiles.trainer_id = auth.uid()
        )
    );

CREATE POLICY "Aluno insere/atualiza sua anamnese"
    ON anamnesis FOR ALL
    USING (client_id = auth.uid());

-- EXERCISES
CREATE POLICY "Personal gerencia seus exercícios"
    ON exercises FOR ALL
    USING (trainer_id = auth.uid());

CREATE POLICY "Aluno vê exercícios do seu personal"
    ON exercises FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.trainer_id = exercises.trainer_id
        )
    );

-- WORKOUT PLANS
CREATE POLICY "Personal gerencia treinos que criou"
    ON workout_plans FOR ALL
    USING (trainer_id = auth.uid());

CREATE POLICY "Aluno vê seus treinos"
    ON workout_plans FOR SELECT
    USING (client_id = auth.uid());

-- WORKOUT DAYS
CREATE POLICY "Personal gerencia divisões dos seus treinos"
    ON workout_days FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM workout_plans
            WHERE workout_plans.id = workout_days.plan_id
            AND workout_plans.trainer_id = auth.uid()
        )
    );

CREATE POLICY "Aluno vê divisões dos seus treinos"
    ON workout_days FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workout_plans
            WHERE workout_plans.id = workout_days.plan_id
            AND workout_plans.client_id = auth.uid()
        )
    );

-- WORKOUT EXERCISES
CREATE POLICY "Personal gerencia exercícios dos seus treinos"
    ON workout_exercises FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM workout_days
            JOIN workout_plans ON workout_plans.id = workout_days.plan_id
            WHERE workout_days.id = workout_exercises.day_id
            AND workout_plans.trainer_id = auth.uid()
        )
    );

CREATE POLICY "Aluno vê exercícios dos seus treinos"
    ON workout_exercises FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM workout_days
            JOIN workout_plans ON workout_plans.id = workout_days.plan_id
            WHERE workout_days.id = workout_exercises.day_id
            AND workout_plans.client_id = auth.uid()
        )
    );

-- WORKOUT LOGS
CREATE POLICY "Aluno gerencia seus próprios logs"
    ON workout_logs FOR ALL
    USING (client_id = auth.uid());

CREATE POLICY "Personal vê logs dos seus alunos"
    ON workout_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = workout_logs.client_id
            AND profiles.trainer_id = auth.uid()
        )
    );

-- ============================================================
-- 10. FUNÇÃO: criar perfil automaticamente ao registrar
-- Dispara quando um usuário é criado no auth.users
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'client')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 11. FUNÇÃO: atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER anamnesis_updated_at
    BEFORE UPDATE ON anamnesis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER workout_plans_updated_at
    BEFORE UPDATE ON workout_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 12. STORAGE BUCKET para fotos de avaliação
-- Execute separado no Supabase Dashboard > Storage
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('assessment-photos', 'assessment-photos', false);

-- ============================================================
-- 13. ÍNDICES para performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_trainer_id ON profiles(trainer_id);
CREATE INDEX IF NOT EXISTS idx_anamnesis_client_id ON anamnesis(client_id);
CREATE INDEX IF NOT EXISTS idx_exercises_trainer_id ON exercises(trainer_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_client_id ON workout_plans(client_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_trainer_id ON workout_plans(trainer_id);
CREATE INDEX IF NOT EXISTS idx_workout_days_plan_id ON workout_days(plan_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_day_id ON workout_exercises(day_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_client_id ON workout_logs(client_id);
