'use server';

import { getUserById } from "@/server/api/users";
import UserModel, { ClientUserModel } from "@/types/models/user";
import { cache } from "react";

export const fetchUser = cache(async (userId : string): Promise<ClientUserModel | null> => {

    const fetchedUser: UserModel | undefined = await getUserById(userId) as UserModel | undefined;
    return fetchedUser ? transformUserToClient(fetchedUser) : null;
});

const transformUserToClient = (serverUser: UserModel) => {
    const {removeBaseData, updateName, updateEmail, updateLastLogin,
        updateActiveValue, getUserType, ...clientUser} = serverUser;
    return clientUser;
}