'use server';

import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Configuración de S3
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'eu-west-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const S3_BUCKET = process.env.AWS_S3_BUCKET || '';

interface DeleteResult {
    ok: boolean;
    message: string;
}

/**
 * Elimina todos los archivos de un prefijo (directorio) en S3
 */
async function deleteS3Directory(prefix: string): Promise<void> {
    // Listar todos los objetos con el prefijo
    const listCommand = new ListObjectsV2Command({
        Bucket: S3_BUCKET,
        Prefix: prefix,
    });

    const listedObjects = await s3Client.send(listCommand);

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        console.log(`[Delete] No se encontraron objetos en S3 con prefijo: ${prefix}`);
        return;
    }

    // Preparar los objetos para eliminar
    const objectsToDelete = listedObjects.Contents.map((obj) => ({
        Key: obj.Key!,
    }));

    // Eliminar los objetos
    const deleteCommand = new DeleteObjectsCommand({
        Bucket: S3_BUCKET,
        Delete: {
            Objects: objectsToDelete,
            Quiet: false,
        },
    });

    await s3Client.send(deleteCommand);
    console.log(`[Delete] Eliminados ${objectsToDelete.length} objetos de S3`);

    // Si hay más objetos (paginación), continuar eliminando
    if (listedObjects.IsTruncated) {
        await deleteS3Directory(prefix);
    }
}

/**
 * Elimina un despliegue de S3 y actualiza el estado en la base de datos
 */
export async function deleteDeployment(orderItemId: string): Promise<DeleteResult> {
    try {
        // 1. Verificar autenticación
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return { ok: false, message: 'No hay sesión de usuario' };
        }

        // 2. Obtener información del OrderItem
        const orderItem = await prisma.orderItem.findUnique({
            where: { id: orderItemId },
            include: {
                order: true,
            },
        });

        if (!orderItem) {
            return { ok: false, message: 'OrderItem no encontrado' };
        }

        // 3. Verificar que el usuario sea el dueño de la orden o sea admin
        const isOwner = orderItem.order.userId === session.user.id;
        const isAdmin = session.user.role === 'Admin';

        if (!isOwner && !isAdmin) {
            return { ok: false, message: 'No tienes permiso para eliminar este despliegue' };
        }

        // 4. Verificar que hay un subdomain para eliminar
        if (!orderItem.subdomain) {
            return { ok: false, message: 'No hay despliegue asociado a este item' };
        }

        // 5. Eliminar archivos de S3
        console.log(`[Delete] Eliminando despliegue: ${orderItem.subdomain}`);
        await deleteS3Directory(orderItem.subdomain);

        // 6. Actualizar estado en la base de datos
        await prisma.orderItem.update({
            where: { id: orderItemId },
            data: {
                deploymentStatus: 'pending',
                deploymentUrl: null,
                subdomain: null,
                deployedAt: null,
            },
        });

        console.log(`[Delete] ✅ Despliegue eliminado correctamente`);

        revalidatePath(`/orders/${orderItem.orderId}`);

        return {
            ok: true,
            message: 'Despliegue eliminado correctamente',
        };

    } catch (error) {
        console.error('[Delete] Error:', error);
        return {
            ok: false,
            message: `Error al eliminar: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        };
    }
}
