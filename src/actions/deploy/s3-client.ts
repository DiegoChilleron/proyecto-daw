'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { promises as fs } from 'fs';
import path from 'path';
import mime from 'mime-types';

// Configuración de S3
export const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'eu-west-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
});

export const S3_BUCKET = process.env.AWS_S3_BUCKET || '';

/**
 * Sube un directorio completo a S3 de forma recursiva
 */
export async function uploadDirToS3(localDir: string, s3Prefix: string): Promise<void> {
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
 * Genera la URL final del despliegue
 * Formato: https://{subdomain}.{DEPLOY_DOMAIN}
 */
export function generateDeploymentUrl(subdomain: string): string {
    const deployDomain = process.env.DEPLOY_DOMAIN || 'dominioprincipal.org';
    return `https://${subdomain}.${deployDomain}`;
}
