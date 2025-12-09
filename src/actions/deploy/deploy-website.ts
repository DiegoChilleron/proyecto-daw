'use server';

import prisma from "@/lib/prisma";
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { revalidatePath } from "next/cache";
import mime from 'mime-types';

const execAsync = promisify(exec);

// Configuración de S3
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'eu-west-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

const S3_BUCKET = process.env.AWS_S3_BUCKET || '';
const TEMPLATES_DIR = path.join(process.cwd(), 'templates');
const BUILDS_DIR = path.join(TEMPLATES_DIR, 'builds');
const SOURCES_DIR = path.join(TEMPLATES_DIR, 'sources');

interface DeployResult {
    ok: boolean;
    message: string;
    deploymentUrl?: string;
}

/**
 * Genera un subdominio único basado en el nombre del sitio y timestamp
 */
function generateSubdomain(siteName: string, orderId: string): string {
    const slug = siteName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 30);
    
    const shortId = orderId.substring(0, 8);
    return `${slug}-${shortId}`;
}

/**
 * Copia un directorio recursivamente
 */
async function copyDir(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // Ignorar node_modules y .next
            if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') {
                continue;
            }
            await copyDir(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

/**
 * Genera el contenido del archivo .env para la instalación
 */
function generateEnvContent(siteConfig: Record<string, unknown>): string {
    const envVars: string[] = [
        '# Configuración generada automáticamente',
        `NEXT_PUBLIC_SITE_NAME="${siteConfig.siteName || ''}"`,
        `NEXT_PUBLIC_SITE_DESCRIPTION="${siteConfig.siteDescription || ''}"`,
        `NEXT_PUBLIC_PRIMARY_COLOR="${siteConfig.primaryColor || '#3B82F6'}"`,
        `NEXT_PUBLIC_SECONDARY_COLOR="${siteConfig.secondaryColor || '#1E40AF'}"`,
        `NEXT_PUBLIC_LOGO_URL="${siteConfig.logo || ''}"`,
        `NEXT_PUBLIC_EMAIL="${siteConfig.email || ''}"`,
        `NEXT_PUBLIC_PHONE="${siteConfig.phone || ''}"`,
        `NEXT_PUBLIC_ADDRESS="${siteConfig.address || ''}"`,
    ];

    // Redes sociales
    const socialLinks = siteConfig.socialLinks as Record<string, string> | undefined;
    if (socialLinks) {
        if (socialLinks.facebook) envVars.push(`NEXT_PUBLIC_FACEBOOK="${socialLinks.facebook}"`);
        if (socialLinks.twitter) envVars.push(`NEXT_PUBLIC_TWITTER="${socialLinks.twitter}"`);
        if (socialLinks.instagram) envVars.push(`NEXT_PUBLIC_INSTAGRAM="${socialLinks.instagram}"`);
        if (socialLinks.linkedin) envVars.push(`NEXT_PUBLIC_LINKEDIN="${socialLinks.linkedin}"`);
        if (socialLinks.github) envVars.push(`NEXT_PUBLIC_GITHUB="${socialLinks.github}"`);
    }

    // Campos personalizados
    const knownFields = ['siteName', 'siteDescription', 'primaryColor', 'secondaryColor', 'logo', 'email', 'phone', 'address', 'socialLinks'];
    for (const [key, value] of Object.entries(siteConfig)) {
        if (!knownFields.includes(key) && value) {
            const envKey = `NEXT_PUBLIC_${key.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
            envVars.push(`${envKey}="${String(value)}"`);
        }
    }

    return envVars.join('\n');
}

/**
 * Sube un directorio completo a S3
 */
async function uploadDirToS3(localDir: string, s3Prefix: string): Promise<void> {
    const entries = await fs.readdir(localDir, { withFileTypes: true });

    for (const entry of entries) {
        const localPath = path.join(localDir, entry.name);
        const s3Key = `${s3Prefix}/${entry.name}`;

        if (entry.isDirectory()) {
            await uploadDirToS3(localPath, s3Key);
        } else {
            const fileContent = await fs.readFile(localPath);
            const contentType = mime.lookup(entry.name) || 'application/octet-stream';

            await s3Client.send(new PutObjectCommand({
                Bucket: S3_BUCKET,
                Key: s3Key,
                Body: fileContent,
                ContentType: contentType,
            }));
        }
    }
}

/**
 * Actualiza el estado del despliegue en la base de datos
 */
async function updateDeploymentStatus(
    orderItemId: string, 
    status: 'pending' | 'building' | 'deploying' | 'deployed' | 'failed',
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
 * Despliega una web para un OrderItem específico
 */
export async function deployWebsite(orderItemId: string): Promise<DeployResult> {
    let buildDir = '';
    
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

        // Actualizar estado a "building"
        await updateDeploymentStatus(orderItemId, 'building', undefined, subdomain);

        // 3. Buscar el template fuente
        const templateSourceDir = path.join(SOURCES_DIR, templateType, templateSlug);
        
        // Verificar si existe el template específico, sino usar el genérico
        let sourceDir = templateSourceDir;
        try {
            await fs.access(templateSourceDir);
        } catch {
            // Usar template genérico del tipo
            const genericTemplateDir = path.join(SOURCES_DIR, templateType);
            const templates = await fs.readdir(genericTemplateDir);
            const firstTemplate = templates.find(t => !t.startsWith('.'));
            if (firstTemplate) {
                sourceDir = path.join(genericTemplateDir, firstTemplate);
            } else {
                await updateDeploymentStatus(orderItemId, 'failed');
                return { ok: false, message: `No se encontró template para ${templateType}` };
            }
        }

        // 4. Copiar template al directorio de builds
        buildDir = path.join(BUILDS_DIR, subdomain);
        await copyDir(sourceDir, buildDir);

        // 5. Generar archivo .env con la configuración del cliente
        const envContent = generateEnvContent(siteConfig);
        await fs.writeFile(path.join(buildDir, '.env'), envContent);

        // También crear .env.local para Next.js
        await fs.writeFile(path.join(buildDir, '.env.local'), envContent);

        // 6. Instalar dependencias y compilar
        console.log(`[Deploy] Instalando dependencias en ${buildDir}`);
        await execAsync('npm install', { cwd: buildDir });

        console.log(`[Deploy] Compilando proyecto...`);
        await execAsync('npm run build', { cwd: buildDir });

        // 7. Actualizar estado a "deploying"
        await updateDeploymentStatus(orderItemId, 'deploying');

        // 8. Subir a S3
        const outDir = path.join(buildDir, 'out');
        
        // Verificar si existe el directorio out (static export)
        try {
            await fs.access(outDir);
        } catch {
            // Si no hay 'out', buscar en '.next/static' o similar
            await updateDeploymentStatus(orderItemId, 'failed');
            return { ok: false, message: 'No se generó el directorio de salida estático. Asegúrate de que next.config.js tenga output: "export"' };
        }

        console.log(`[Deploy] Subiendo a S3: ${subdomain}`);
        await uploadDirToS3(outDir, subdomain);

        // 9. Generar URL final
        const deploymentUrl = `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${subdomain}/index.html`;
        
        // Si tienes CloudFront configurado, usar esa URL
        const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;
        const finalUrl = cloudfrontDomain 
            ? `https://${cloudfrontDomain}/${subdomain}`
            : deploymentUrl;

        // 10. Actualizar estado a "deployed"
        await updateDeploymentStatus(orderItemId, 'deployed', finalUrl, subdomain);

        // 11. Limpiar directorio de build (opcional, para ahorrar espacio)
        // await fs.rm(buildDir, { recursive: true, force: true });

        console.log(`[Deploy] ✅ Desplegado exitosamente: ${finalUrl}`);

        revalidatePath(`/orders/${orderItem.orderId}`);

        return {
            ok: true,
            message: 'Web desplegada correctamente',
            deploymentUrl: finalUrl,
        };

    } catch (error) {
        console.error('[Deploy] Error:', error);
        
        // Actualizar estado a failed
        try {
            await updateDeploymentStatus(orderItemId, 'failed');
        } catch {}

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
