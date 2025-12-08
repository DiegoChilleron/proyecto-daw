'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/dist/server/request/headers';


export const getOrdersByUser = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return {
            ok: false,
            message: 'No hay sesión de usuario'
        }
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: {
            orderAddress: {
                select: {
                    firstName: true,
                    lastName: true,
                }
            }
        }
    });

    return { ok: true, orders: orders };
}