'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { DeployResult } from './types';
import { generateSubdomain } from './subdomain-generator';
import { updateDeploymentStatus, markDeploymentFailed } from './deployment-status';
import { 
    findTemplateSource, 
    prepareBuildDirectory, 
    configureEnvironment, 
    buildProject,
    getOutputDirectory 
} from './template-builder';
import { uploadDirToS3, generateDeploymentUrl } from './s3-client';

/**
 * Despliega una web para un OrderItem específico
 */
export async function deployWebsite(orderItemId: string): Promise<DeployResult> {
    try {
        // 1. Obtener información del OrderItem
        const orderItem = await prisma.orderItem.findUnique({
            where: { id: orderItemId },
            include: {
                product: true,
                order: true,
            },
        });

        if (!orderItem) {
            return { ok: false, message: 'OrderItem no encontrado' };
        }

        if (!orderItem.order.isPaid) {
            return { ok: false, message: 'El pedido no está pagado' };
        }

        const siteConfig = orderItem.siteConfig as Record<string, unknown>;
        const templateType = orderItem.product.templateType;
        const templateSlug = orderItem.product.slug;

        // 2. Generar subdominio único
        const subdomain = generateSubdomain(
            (siteConfig.siteName as string) || orderItem.product.title,
            orderItem.id
        );

        // 3. Buscar el template fuente
        const sourceDir = await findTemplateSource(templateType, templateSlug);
        
        if (!sourceDir) {
            await markDeploymentFailed(orderItemId);
            return { ok: false, message: `No se encontró template para ${templateType}` };
        }

        // 5. Preparar directorio de build
        const buildDir = await prepareBuildDirectory(sourceDir, subdomain);

        // 6. Configurar variables de entorno
        await configureEnvironment(buildDir, siteConfig);

        // 7. Compilar el proyecto
        await buildProject(buildDir);

        // 8. Obtener directorio de salida
        const outDir = await getOutputDirectory(buildDir);
        
        if (!outDir) {
            await markDeploymentFailed(orderItemId);
            return { 
                ok: false, 
                message: 'No se generó el directorio de salida estático. Asegúrate de que next.config.js tenga output: "export"' 
            };
        }

        // 9. Subir a S3
        console.log(`[Deploy] Subiendo a S3: ${subdomain}`);
        await uploadDirToS3(outDir, subdomain);

        // 10. Generar URL final
        const finalUrl = generateDeploymentUrl(subdomain);

        // 11. Actualizar estado a "deployed"
        await updateDeploymentStatus(orderItemId, 'deployed', finalUrl, subdomain);

        // 12. Limpiar directorio de build (opcional)
        // await removeDir(buildDir);

        console.log(`[Deploy] ✅ Desplegado exitosamente: ${finalUrl}`);

        revalidatePath(`/orders/${orderItem.orderId}`);

        return {
            ok: true,
            message: 'Web desplegada correctamente',
            deploymentUrl: finalUrl,
        };

    } catch (error) {
        console.error('[Deploy] Error:', error);
        
        await markDeploymentFailed(orderItemId);

        return {
            ok: false,
            message: `Error en el despliegue: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        };
    }
}

/**
 * Despliega todas las webs de una orden después del pago
 */
export async function deployOrderWebsites(orderId: string): Promise<DeployResult[]> {
    const orderItems = await prisma.orderItem.findMany({
        where: { orderId },
    });

    const results: DeployResult[] = [];

    for (const item of orderItems) {
        const result = await deployWebsite(item.id);
        results.push(result);
    }

    return results;
}
