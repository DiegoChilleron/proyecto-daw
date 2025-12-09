'use server';

import { promises as fs } from 'fs';
import path from 'path';

/**
 * Copia un directorio recursivamente, ignorando node_modules, .next y .git
 */
export async function copyDir(src: string, dest: string): Promise<void> {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // Ignorar node_modules, .next y .git
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
 * Verifica si un directorio existe
 */
export async function directoryExists(dirPath: string): Promise<boolean> {
    try {
        await fs.access(dirPath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Elimina un directorio recursivamente
 */
export async function removeDir(dirPath: string): Promise<void> {
    await fs.rm(dirPath, { recursive: true, force: true });
}

/**
 * Escribe contenido en un archivo
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
    await fs.writeFile(filePath, content);
}
