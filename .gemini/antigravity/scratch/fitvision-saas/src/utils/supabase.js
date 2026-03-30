'use client';

import { createBrowserClient } from '@supabase/ssr';

// Cliente para uso em Client Components (browser)
export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
