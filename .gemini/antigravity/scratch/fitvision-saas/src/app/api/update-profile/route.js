import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
    // Usuário já validado pelo middleware — lê o id injetado como header
    const userId = request.headers.get('x-user-id');
    if (!userId) {
        return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const { full_name, phone, cref } = await request.json();

    const { error } = await supabaseAdmin
        .from('trainer_profiles')
        .update({ full_name, phone, cref, updated_at: new Date().toISOString() })
        .eq('id', userId);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
