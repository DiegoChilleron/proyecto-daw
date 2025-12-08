'use server';

import { headers } from "next/headers";
import { auth } from "./auth";

// Acción para crear una nueva cuenta de usuario
export const signUp = async (email: string, password: string, name: string) => {
    const result = await auth.api.signUpEmail({
        body: {
            email,
            password,
            name,
            callbackURL: "/dashboard",
        },
    });

    return result;
};


// Acción para iniciar sesión de usuario
export const signIn = async (email: string, password: string) => {
    const result = await auth.api.signInEmail({
        body: {
            email,
            password,
            callbackURL: "/dashboard",
        },
    });

    return result;
};


// Acción para cerrar sesión de usuario
export const signOut = async () => {
    const result = await auth.api.signOut({ headers: await headers() });
    return result;
};