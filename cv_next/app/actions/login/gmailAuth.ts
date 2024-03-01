"use server"

import SupabaseHelper  from "@/server/api/supabaseHelper"  
import { redirect } from 'next/navigation'

export async function login()
{
    const supabase = SupabaseHelper.createServerComponent()
    const { data: signin_data , error: error_msg } = await supabase.auth.signInWithOAuth(
        {
            provider: 'google', 
            options: { 
                redirectTo: 'http://localhost:3000/auth/callback',
                skipBrowserRedirect: false
            }
        }
    )
    if(signin_data)
    {
        // For some reason ssr doesnt redirect you on it's own...
        redirect(signin_data['url'] || '/inactive')
    }
    redirect('/inactive')
}