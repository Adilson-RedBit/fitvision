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
