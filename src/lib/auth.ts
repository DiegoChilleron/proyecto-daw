

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({

    // ORM o BBDD
    database: prismaAdapter(prisma, { provider: "postgresql"}),

    // Campos personalizados del usuario
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "User",
                returned: true, // Asegurar que se retorne en las respuestas
            },
        },
    },

    // Usuario y contraseña
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Desactivar verificación obligatoria
       // autoSignIn: false //defaults to true
    },

    // Proveedores sociales (para login/autenticación)
    // socialProviders: {
    //     github: {
    //         clientId: process.env.GITHUB_CLIENT_ID as string,
    //         clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    //     },
    //     google: { 
    //         clientId: process.env.GOOGLE_CLIENT_ID as string, 
    //         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
    //     },
    //     paypal: { 
    //         clientId: process.env.PAYPAL_CLIENT_ID as string, 
    //         clientSecret: process.env.PAYPAL_CLIENT_SECRET as string, 
    //         environment: "sandbox", // o "live" para producción
    //     }, 
    // },

    plugins:[nextCookies()],

});