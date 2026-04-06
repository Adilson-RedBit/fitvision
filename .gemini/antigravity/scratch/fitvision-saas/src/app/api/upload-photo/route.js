import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    // Inicializa dentro do handler para garantir acesso às env vars em runtime
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    try {
        const { studentId, side, base64DataUrl } = await request.json();

        if (!studentId || !side || !base64DataUrl) {
            return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
        }

        // Converte base64 data URL para Buffer
        const [header, data] = base64DataUrl.split(',');
        const mime = header.match(/:(.*?);/)[1];
        const buffer = Buffer.from(data, 'base64');

        const path = `${studentId}/${side}.jpg`;

        const { error: uploadError } = await supabaseAdmin.storage
            .from('assessment-photos')
            .upload(path, buffer, { upsert: true, contentType: mime });

        if (uploadError) {
            console.error('upload-photo error:', uploadError.message);
            return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        const { data: signed } = await supabaseAdmin.storage
            .from('assessment-photos')
            .createSignedUrl(path, 60 * 60 * 24 * 365); // 1 ano

        return NextResponse.json({ url: signed?.signedUrl || null });
    } catch (err) {
        console.error('upload-photo exception:', err);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
