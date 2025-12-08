'use server';

import { Address, SiteConfig } from '@/interfaces';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';


interface ProductToOrder {
    productId: string;
    quantity: number;
    siteConfig: SiteConfig;
}


export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    const userId = session?.user.id;

    // Verificar que exista sesión de usuario
    if (!userId) {
        return {
            ok: false,
            message: 'No hay sesión de usuario'
        }
    }

    // Obtener la información de los productos en el carrito
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(p => p.productId)
            }
        }
    });

    // Calcular el total de la orden
    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

    // Los totales de tax, subtotal y total
    const { subTotal, tax, total } = productIds.reduce((totals, item) => {

        const productQuantity = item.quantity;
        const product = products.find(product => product.id === item.productId);

        if (!product) throw new Error(`${item.productId} no existe`);

        const subTotal = product.price * productQuantity;
        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.21;
        totals.total += subTotal * 1.21;

        return totals;

    }, { subTotal: 0, tax: 0, total: 0 });


    // Crear la orden en la base de datos (transaccion de Prisma)(tx)

    try {
        const prismaTx = await prisma.$transaction(async (tx) => {

            // Las plantillas web no tienen stock - se pueden vender ilimitadamente

            // 1. Crear la orden - Encabezado - Detalles
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,

                    orderItems: {
                        createMany: {
                            data: productIds.map(p => ({
                                quantity: p.quantity,
                                siteConfig: p.siteConfig,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0,
                            }))
                        }
                    },
                }
            });

            // Validar, si el price es cero, entonces, lanzar un error

            // 3. Crear la direccion de la orden
            const { country, rememberAddress, ...restAddress } = address;
            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id,
                }
            });

            return {
                updatedProducts: updatedProducts,
                order: order,
                orderAddress: orderAddress,
            }
        });

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx: prismaTx,
        };

    } catch (error: any) {
        return {
            ok: false,
            message: error?.message,
        }
    }
}
