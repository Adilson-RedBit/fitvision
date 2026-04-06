'use client';

import { supabase } from './supabase';

// ============================================================
// HELPERS INTERNOS
// ============================================================

async function getTrainerId() {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
}

// Converte registro do Supabase para o formato usado pelo código existente
function toAppFormat(record) {
    if (!record) return null;
    return {
        id: record.id,
        name: record.name,
        email: record.email || '',
        phone: record.phone || '',
        avatar: record.avatar || '👤',
        status: record.status || 'Prospect',
        isProspect: record.is_prospect ?? true,
        paymentStatus: record.payment_status || 'pending',
        onboardingLink: record.onboarding_link || `/onboarding/${record.id}`,
        anamnesis: record.anamnesis || null,
        workouts: record.workouts || [],
        feedbacks: record.feedbacks || [],
        seriesData: record.series_data?.series || null,
        completedSplits: record.series_data?.completedSplits || null,
        createdAt: record.created_at
            ? new Date(record.created_at).toLocaleDateString('pt-BR')
            : '',
    };
}

// Converte do formato do app para o formato do Supabase
function toDbFormat(studentData, trainerId) {
    const record = {};

    if (studentData.name !== undefined)
        record.name = studentData.name;
    if (studentData.email !== undefined)
        record.email = studentData.email;
    if (studentData.phone !== undefined)
        record.phone = studentData.phone;
    if (studentData.avatar !== undefined)
        record.avatar = studentData.avatar;
    if (studentData.status !== undefined)
        record.status = studentData.status;
    if (studentData.isProspect !== undefined)
        record.is_prospect = studentData.isProspect;
    if (studentData.paymentStatus !== undefined)
        record.payment_status = studentData.paymentStatus;
    if (studentData.onboardingLink !== undefined)
        record.onboarding_link = studentData.onboardingLink;
    if (studentData.anamnesis !== undefined)
        record.anamnesis = studentData.anamnesis;
    if (studentData.workouts !== undefined)
        record.workouts = studentData.workouts;
    if (studentData.feedbacks !== undefined)
        record.feedbacks = studentData.feedbacks;
    if (studentData.seriesData !== undefined || studentData.completedSplits !== undefined)
        record.series_data = {
            series: studentData.seriesData || null,
            completedSplits: studentData.completedSplits || null,
        };
    if (trainerId)
        record.trainer_id = trainerId;

    return record;
}

function dispatch() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('fitvision_storage_update'));
    }
}

// ============================================================
// API PÚBLICA — mesmas funções do storage.js antigo
// ============================================================

/**
 * Busca todos os alunos do trainer logado
 * Substitui: getStudentsDB()
 */
export async function getStudentsDB() {
    const trainerId = await getTrainerId();
    if (!trainerId) return {};

    const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('trainer_id', trainerId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('getStudentsDB:', error.message);
        return {};
    }

    const result = {};
    data.forEach(record => {
        result[record.id] = toAppFormat(record);
    });
    return result;
}

/**
 * Busca um aluno pelo e-mail (para uso no portal do aluno, sem filtro de trainer)
 */
export async function getStudentByEmail(email) {
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .ilike('anamnesis->>email', email)
        .limit(1)
        .single();

    if (error) {
        // tenta também pelo campo email direto
        const { data: data2, error: error2 } = await supabase
            .from('students')
            .select('*')
            .ilike('email', email)
            .limit(1)
            .single();

        if (error2) return null;
        return toAppFormat(data2);
    }

    return toAppFormat(data);
}

/**
 * Busca um aluno por ID
 * Substitui: getStudent(id)
 */
export async function getStudent(id) {
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('getStudent:', error.message);
        return null;
    }

    return toAppFormat(data);
}

/**
 * Salva/atualiza dados de um aluno
 * Substitui: saveStudent(id, studentData)
 */
export async function saveStudent(id, studentData) {
    const record = toDbFormat(studentData);
    record.updated_at = new Date().toISOString();

    const { error } = await supabase
        .from('students')
        .update(record)
        .eq('id', id);

    if (error) {
        console.error('saveStudent:', error.message);
        throw error;
    }

    dispatch();
}

/**
 * Remove um aluno
 * Substitui: deleteStudent(id)
 */
export async function deleteStudent(id) {
    const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('deleteStudent:', error.message);
        throw error;
    }

    dispatch();
}

/**
 * Cria um novo aluno (prospect)
 * Substitui: createProspect(name, email, phone, goal)
 */
export async function createProspect(name, email, phone, goal) {
    const trainerId = await getTrainerId();
    if (!trainerId) throw new Error('Não autenticado');

    const newId = crypto.randomUUID();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const onboardingLink = `${origin}/onboarding/${newId}`;

    const record = {
        id: newId,
        trainer_id: trainerId,
        name: name.toUpperCase(),
        email: email || '',
        phone: phone || '',
        status: 'Prospect',
        is_prospect: true,
        payment_status: 'pending',
        onboarding_link: onboardingLink,
        anamnesis: null,
        workouts: [],
        feedbacks: [],
    };

    const { data, error } = await supabase
        .from('students')
        .insert(record)
        .select()
        .single();

    if (error) {
        console.error('createProspect:', error.message);
        throw error;
    }

    dispatch();
    return toAppFormat(data);
}

// ============================================================
// AUTENTICAÇÃO
// ============================================================

/**
 * Login do personal trainer
 */
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
    });
    if (error) throw error;
    return data;
}

/**
 * Logout
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

/**
 * Usuário atual
 */
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/**
 * Recuperação de senha
 */
export async function resetPassword(email) {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${origin}/auth/reset-password` }
    );
    if (error) throw error;
}

// ============================================================
// EXERCÍCIOS
// ============================================================

/**
 * Busca todos os exercícios do trainer (padrão + customizados)
 */
export async function getExercisesDB() {
    const trainerId = await getTrainerId();
    if (!trainerId) return [];

    const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('trainer_id', trainerId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('getExercisesDB:', error.message);
        return [];
    }

    return data || [];
}

/**
 * Cria um exercício customizado
 */
export async function createExercise({ name, muscle_group, equipment, video_url, description }) {
    const trainerId = await getTrainerId();
    if (!trainerId) throw new Error('Não autenticado');

    const { data, error } = await supabase
        .from('exercises')
        .insert({ trainer_id: trainerId, name, muscle_group, equipment, video_url: video_url || null, description: description || null })
        .select()
        .single();

    if (error) {
        console.error('createExercise:', error.message);
        throw error;
    }

    dispatch();
    return data;
}

/**
 * Deleta um exercício customizado
 */
export async function deleteExercise(id) {
    const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('deleteExercise:', error.message);
        throw error;
    }

    dispatch();
}

// ============================================================
// PERFIL DO TRAINER
// ============================================================

/**
 * Busca o perfil do trainer logado
 */
export async function getTrainerProfile() {
    const trainerId = await getTrainerId();
    if (!trainerId) return null;

    const { data, error } = await supabase
        .from('trainer_profiles')
        .select('*')
        .eq('id', trainerId)
        .single();

    if (error) {
        console.error('getTrainerProfile:', error.message);
        return null;
    }

    return data;
}

/**
 * Atualiza o perfil do trainer logado
 */
export async function updateTrainerProfile({ full_name, phone, cref }) {
    const trainerId = await getTrainerId();
    if (!trainerId) throw new Error('Não autenticado');

    const { error } = await supabase
        .from('trainer_profiles')
        .update({ full_name, phone, cref, updated_at: new Date().toISOString() })
        .eq('id', trainerId);

    if (error) {
        console.error('updateTrainerProfile:', error.message);
        throw error;
    }
}

// ============================================================
// FOTOS DE AVALIAÇÃO — Supabase Storage
// ============================================================

/**
 * Faz upload de uma foto de avaliação (base64 → Storage)
 * Retorna a URL pública assinada da foto
 */
export async function uploadAssessmentPhoto(studentId, side, base64DataUrl) {
    if (!base64DataUrl) return null;

    // Converte base64 data URL para Blob
    const [header, data] = base64DataUrl.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mime });

    const path = `${studentId}/${side}.jpg`;

    const { error } = await supabase.storage
        .from('assessment-photos')
        .upload(path, blob, { upsert: true, contentType: 'image/jpeg' });

    if (error) {
        console.error('uploadAssessmentPhoto:', error.message);
        throw error;
    }

    const { data: signed } = await supabase.storage
        .from('assessment-photos')
        .createSignedUrl(path, 60 * 60 * 24 * 365); // 1 ano

    return signed?.signedUrl || null;
}

/**
 * Faz upload de uma foto de renovação de treino (base64 → Storage)
 * Retorna a URL assinada da foto
 */
export async function uploadRenewalPhoto(studentId, renewalTimestamp, side, base64DataUrl) {
    if (!base64DataUrl) return null;

    const [header, data] = base64DataUrl.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mime });

    const path = `${studentId}/renewal-${renewalTimestamp}/${side}.jpg`;

    const { error } = await supabase.storage
        .from('assessment-photos')
        .upload(path, blob, { upsert: true, contentType: 'image/jpeg' });

    if (error) {
        console.error('uploadRenewalPhoto:', error.message);
        throw error;
    }

    const { data: signed } = await supabase.storage
        .from('assessment-photos')
        .createSignedUrl(path, 60 * 60 * 24 * 365);

    return signed?.signedUrl || null;
}

/**
 * Gera URLs assinadas frescas para as fotos de um aluno
 * (use quando exibir fotos no dashboard — URLs expiram)
 */
export async function refreshAssessmentPhotoUrls(studentId, photos) {
    if (!photos) return photos;
    const sides = ['front', 'back', 'right', 'left'];
    const updated = { ...photos };

    await Promise.all(sides.map(async (side) => {
        if (!photos[side]) return;
        // Se já é uma URL assinada do Supabase, renova; se for base64 legado, mantém
        if (photos[side].startsWith('https://')) {
            const { data } = await supabase.storage
                .from('assessment-photos')
                .createSignedUrl(`${studentId}/${side}.jpg`, 60 * 60 * 24 * 365);
            if (data?.signedUrl) updated[side] = data.signedUrl;
        }
    }));

    return updated;
}
