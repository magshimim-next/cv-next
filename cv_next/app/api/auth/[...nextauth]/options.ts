import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from "next-auth/providers/google";
import { GoogleProfile } from "next-auth/providers/google";
import UserModel from "../../../../types/models/user";
import UsersApi from "../../../../server/api/users";
import { ErrorReasons } from "../../../../server/api/utils"

export const options: NextAuthOptions = {
    providers: [
        GoogleProvider({
            async profile(profile: GoogleProfile) {
                console.log("here %s", process.env.GOOGLE_CLIENT_ID)
                let loggedUser = new UserModel(profile.sub, profile.name || '{}', profile.email || '{}', 0);
                let userActive = 0;
                let res = await UsersApi.addNewUser(loggedUser);
                if(res.success)
                {
                    console.log("New user was created but by default is inactive");
                }
                else if(res.reason == ErrorReasons.emailExists)
                {
                    let existingUser = await UsersApi.getUserByEmail(loggedUser.email, true);
                    if(existingUser !== null && existingUser.length > 0)
                    {
                        console.log("Existing user is active - %d %d", existingUser[0].getUserType());
                        userActive = existingUser[0].getUserType();
                    }
                    else
                    {
                        console.log("Existing user is inactive");
                    }
                }
                else
                {
                    console.log("An unexpected error");
                }
                return {
                    ...profile,
                    role: profile.role ?? userActive.toString(),
                    id: profile.sub.toString(),
                }
            },
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        // Ref: https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
        async jwt({ token, user }) {
            if (user) token.role = user.role
            return token
        },
        // If you want to use the role in client components
        async session({ session, token }) {
            if (session?.user) session.user.role = token.role
            return session
        },
    }
}