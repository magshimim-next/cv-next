import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from "next-auth/providers/google";
import { GoogleProfile } from "next-auth/providers/google";
import UserModel from "../../../../types/models/user";
import UsersApi from "../../../../server/api/users";
import { ErrorReasons } from "../../../../server/api/utils"
import MyLogger from "@/server/base/logger";

export const options: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            async profile(profile: GoogleProfile) {
                let loggedUser = new UserModel(profile.sub, profile.name || '{}', profile.email || '{}', 0);
                let userActive = 0;
                let res = await UsersApi.addNewUser(loggedUser);
                if(res.success)
                {
                    MyLogger.logDebug(
                        `New user was created but by default is inactive`
                    )
                }
                else if(res.reason == ErrorReasons.emailExists)
                {
                    let existingUser = await UsersApi.getUserByEmail(loggedUser.email, true);
                    if(existingUser !== null && existingUser.length > 0)
                    {
                        MyLogger.logDebug(
                            `Existing user is active - ${existingUser[0].getUserType()}`
                        )
                        userActive = existingUser[0].getUserType();
                    }
                    else
                    {
                        MyLogger.logDebug(
                            `Existing user is inactive`
                        )
                    }
                }
                else
                {
                    MyLogger.logDebug(
                        `An unexpected error`
                    )
                }
                return {
                    ...profile,
                    role: profile.role ?? userActive.toString(),
                    id: profile.sub.toString(),
                    name: profile.name,
                    email: profile.email
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
        async redirect({url, baseUrl}) {
            if (url.endsWith("signout")) return '${baseUrl}'
            return baseUrl
        }
    }
}
