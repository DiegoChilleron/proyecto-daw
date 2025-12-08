'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/dist/server/request/headers';


export const getPaginatedOrders = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (session?.user.role !== 'Admin') {
        return {
            ok: false,
            message: 'No hay sesión de usuario'
        }
    }

    const orders = await prisma.order.findMany({
        orderBy: {
            createdAt: 'desc'
        },
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