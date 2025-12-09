'use server';

import prisma from "@/lib/prisma";

export type DeploymentStatusType = 'pending' | 'building' | 'deploying' | 'deployed' | 'failed';

/**
 * Actualiza el estado del despliegue en la base de datos
 */
export async function updateDeploymentStatus(
    orderItemId: string, 
    status: DeploymentStatusType,
    deploymentUrl?: string,
    subdomain?: string
): Promise<void> {
    await prisma.orderItem.update({
        where: { id: orderItemId },
        data: {
            deploymentStatus: status,
            ...(deploymentUrl && { deploymentUrl }),
            ...(subdomain && { subdomain }),
            ...(status === 'deployed' && { deployedAt: new Date() }),
        },
    });
}

/**
 * Marca un despliegue como fallido
 */
export async function markDeploymentFailed(orderItemId: string): Promise<void> {
    try {
        await updateDeploymentStatus(orderItemId, 'failed');
    } catch (error) {
        console.error('[Deploy] Error al marcar como fallido:', error);
    }
}
