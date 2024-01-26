/* eslint-disable @next/next/no-async-client-component */
"use client"
import SupabaseHelper from '@/server/api/supabaseHelper'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default async function Page() {
    //const supabase = SupabaseHelper.getSupabaseInstance()
    const supabaseClient = createPagesBrowserClient()
    return (
        <main>
            <Auth
                supabaseClient={supabaseClient}
                appearance={{ theme: ThemeSupa }}
                providers={['google']}
                theme="dark"
              />
        </main>
    )
  }
  