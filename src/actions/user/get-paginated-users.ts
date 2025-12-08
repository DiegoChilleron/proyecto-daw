'use server';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/dist/server/request/headers";

export const getPaginatedUsers = async () => {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session?.user.role !== 'Admin') {
        return {
            ok: false,
            message: 'Usuario no autorizado'
        }
    }

    const users = await prisma.user.findMany({
        orderBy: {
            name: 'desc'
        },
    });

    return { ok: true, users: users };  
}