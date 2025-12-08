'use server';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/dist/server/request/headers';

export const getOrderById = async (id: string) => {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        return {
            ok: false,
            message: 'No hay sesión de usuario'
        }
    }

    try {

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                orderAddress: true,
                orderItems: {
                    select: {
                        price: true,
                        quantity: true,
                        siteConfig: true,
                        deploymentStatus: true,
                        deploymentUrl: true,
                        subdomain: true,

                        product: {
                            select: {
                                title: true,
                                slug: true,

                                productImages: {
                                    select: {
                                        url: true
                                    },
                                    take: 1
                                }
                            }
                        }
                    }
                }
            }
        });


        if (!order) throw `Orden no encontrada: ${id}`;

        if (session.user.role === 'User') {
            if (session.user.id !== order.userId) {
                throw `No autorizado para ver la orden: ${id}`;
            }
        }

        return { ok: true, order: order }

    } catch (error) {
        return {
            ok: false,
            message: 'Error al obtener la orden'
        }
    }
}