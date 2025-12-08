'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { TemplateType } from '../../../generated/prisma/enums';
import { Product } from '../../../generated/prisma/client';
import { z } from 'zod';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');


const productSchema = z.object({

    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce.number().min(0).transform(val => Number(val.toFixed(2))),
    categoryId: z.string().uuid(),
    tags: z.string(),
    templateType: z.nativeEnum(TemplateType),
    demoUrl: z.string().url().optional().nullable(),
    features: z.coerce.string().transform(val => val.split(',')).optional(),
    formFields: z.string().optional(), // JSON string
});


export const createUpdateProduct = async (formData: FormData) => {

    const data = Object.fromEntries(formData);
    const productParsed = productSchema.safeParse(data);

    if (!productParsed.success) {
        console.log(productParsed.error);
        return { ok: false }
    }

    const product = productParsed.data;
    product.slug = product.slug.toLowerCase().replace(/ /g, '-').trim();


    const { id, formFields, features, ...rest } = product;

    try {
        const prismaTx = await prisma.$transaction(async (tx) => {

            let product: Product;
            const tagsArray = rest.tags.split(',').map(tag => tag.trim().toLowerCase());
            const featuresArray = features?.map(f => f.trim()) ?? [];
            const formFieldsJson = formFields ? JSON.parse(formFields) : [];

            if (id) {
                // Actualizar
                product = await prisma.product.update({
                    where: { id },
                    data: {
                        ...rest,
                        tags: { set: tagsArray },
                        features: { set: featuresArray },
                        formFields: formFieldsJson,
                    }
                });

            } else {
                // Crear
                product = await prisma.product.create({
                    data: {
                        ...rest,
                        tags: { set: tagsArray },
                        features: { set: featuresArray },
                        formFields: formFieldsJson,
                    }
                })
            }


            // Proceso de carga y guardado de imagenes
            if (formData.getAll('images')) {

                const images = await uploadImages(formData.getAll('images') as File[]);

                if (!images) { throw new Error('No se han cargado las imágenes') };

                await prisma.productImage.createMany({
                    data: images.map(image => ({
                        url: image!,
                        productId: product.id,
                    }))
                });

            }

            return {
                product
            }
        });

        revalidatePath('/admin/products');
        revalidatePath(`/admin/product/${product.slug}`);
        revalidatePath(`/products/${product.slug}`);

        return {
            ok: true,
            product: prismaTx.product,
        }


    } catch (error) {

        return {
            ok: false,
            message: 'Revisar los logs, no se pudo actualizar/crear'
        }
    }

}



const uploadImages = async (images: File[]) => {

    try {

        const uploadPromises = images.map(async (image) => {

            try {
                const buffer = await image.arrayBuffer();
                const base64Image = Buffer.from(buffer).toString('base64');

                return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`)
                    .then(r => r.secure_url);

            } catch (error) {
                console.log(error);
                return null;
            }
        })


        const uploadedImages = await Promise.all(uploadPromises);
        return uploadedImages;

    } catch (error) {

        console.log(error);
        return null;

    }
}