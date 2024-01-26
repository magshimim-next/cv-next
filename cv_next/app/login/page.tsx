/* eslint-disable @next/next/no-async-client-component */
"use client"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default async function Page() {
    //const supabase = SupabaseHelper.getSupabaseInstance()
    const supabaseClient = createClientComponentClient()
    return (
        <main>
            <Auth
                supabaseClient={supabaseClient}
                appearance={{ theme: ThemeSupa }}
                providers={['google']}
                theme="dark"
                onlyThirdPartyProviders
              />
        </main>
    )
  }
  