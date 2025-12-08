'use server';

import { auth } from "@/lib/auth";
import { headers } from "next/dist/server/request/headers";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const changeUserRole = async (userId: string, role: string) => {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session?.user.role !== 'Admin') {
        return {
            ok: false,
            message: 'Usuario no autorizado'
        }
    }

    try {

        const newRole = role === 'Admin' ? 'Admin' : 'User';

        const user = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }
        });

        revalidatePath('/admin/users');

        return {
            ok: true,
            user
        };


    } catch (error) {
        return {
            ok: false,
            message: 'Error al cambiar el rol del usuario'
        }

    }
}