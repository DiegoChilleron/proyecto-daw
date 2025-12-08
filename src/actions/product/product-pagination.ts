'use server';

import prisma from "@/lib/prisma";
import { TemplateType } from "../../../generated/prisma/client";


interface PaginationOptions {
    page?: number;
    take?: number;
    templateType?: TemplateType;
}

export const getPaginatedProductsWithImages = async ({ page = 1, take = 6, templateType }: PaginationOptions) => {

    if (isNaN(page) || isNaN(take) || page < 1 || take < 1) {
        page = 1;
        take = 6;
    }

    try {

        //1. Obtener los productos

        const products = await prisma.product.findMany({
            take: take,
            skip: (page - 1) * take,
            include: {
                productImages: {
                    take: 2,
                    select: {
                        url: true
                    },
                },
            },
            where: templateType ? { templateType } : undefined,
        })

        //2. Obtener el total de productos
        const totalCount = await prisma.product.count({ where: templateType ? { templateType } : undefined });
        const totalPages = Math.ceil(totalCount / take);

        //3. Devolver los productos con paginación
        return {
            currentPage: page,
            totalPages: totalPages,
            products: products.map(product => ({
                ...product,
                images: product.productImages.map(img => img.url)
            }))
        };

    } catch (error) {
        throw new Error('No se pudo cargar los productos');
    }
}