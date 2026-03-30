import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Rotas públicas — não precisam de autenticação
    const publicRoutes = ['/', '/login', '/apresentacao', '/auth'];
    const isPublic = publicRoutes.some(route => pathname === route || pathname.startsWith(route));

    // Onboarding é público (aluno preenche sem login)
    if (pathname.startsWith('/onboarding')) return NextResponse.next();
    if (isPublic) return NextResponse.next();

    // Verificar sessão Supabase
    let response = NextResponse.next({ request });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                    });
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Sem sessão — redirecionar para login
    if (!user) {
        // Área do personal
        if (pathname.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        // Área do aluno
        if (pathname.startsWith('/client/portal')) {
            return NextResponse.redirect(new URL('/client', request.url));
        }
        return NextResponse.next();
    }

    // Com sessão — verificar role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    // Aluno tentando acessar dashboard do personal
    if (pathname.startsWith('/dashboard') && profile?.role === 'client') {
        return NextResponse.redirect(new URL('/client/portal', request.url));
    }

    // Personal tentando acessar portal do aluno
    if (pathname.startsWith('/client/portal') && profile?.role === 'trainer') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Usuário logado tentando acessar /login — redirecionar para área correta
    if (pathname === '/login') {
        if (profile?.role === 'trainer') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        if (profile?.role === 'client') {
            return NextResponse.redirect(new URL('/client/portal', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
