'use server';

import prisma from "@/lib/prisma";


export const getProductBySlug = async (slug: string) => {
    try {

        const product = await prisma.product.findFirst({
            include: { productImages: true },
            where: { slug: slug },
        });

        if (!product) return null;

        return {
            ...product,
            images: product.productImages.map(image => image.url)
        };


    } catch (error) {
        throw new Error('No se pudo cargar el producto');
    }
}
