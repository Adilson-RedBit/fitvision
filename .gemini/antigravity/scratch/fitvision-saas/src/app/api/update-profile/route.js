import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { trainer_id, full_name, phone, cref } = await request.json();

    if (!trainer_id) {
        return NextResponse.json({ error: 'trainer_id obrigatório' }, { status: 400 });
    }

    // Usa service role — rota já protegida pelo middleware (só autenticados chegam aqui)
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabaseAdmin
        .from('trainer_profiles')
        .update({ full_name, phone, cref, updated_at: new Date().toISOString() })
        .eq('id', trainer_id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
