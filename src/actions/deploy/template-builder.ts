'use server';

import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import { copyDir, directoryExists, writeFile } from './file-utils';
import { generateEnvContent } from './env-generator';

const execAsync = promisify(exec);

const TEMPLATES_DIR = path.join(process.cwd(), 'templates');
export const BUILDS_DIR = path.join(TEMPLATES_DIR, 'builds');
export const SOURCES_DIR = path.join(TEMPLATES_DIR, 'sources');

/**
 * Busca el directorio fuente de la plantilla
 */
export async function findTemplateSource(templateType: string, templateSlug: string): Promise<string | null> {
    const templateSourceDir = path.join(SOURCES_DIR, templateType, templateSlug);
    
    // Verificar si existe el template específico
    if (await directoryExists(templateSourceDir)) {
        return templateSourceDir;
    }

    // Usar template genérico del tipo
    const genericTemplateDir = path.join(SOURCES_DIR, templateType);
    
    try {
        const templates = await fs.readdir(genericTemplateDir);
        const firstTemplate = templates.find(t => !t.startsWith('.'));
        
        if (firstTemplate) {
            return path.join(genericTemplateDir, firstTemplate);
        }
    } catch {
        // El directorio no existe
    }

    return null;
}

/**
 * Prepara el directorio de build copiando la plantilla fuente
 */
export async function prepareBuildDirectory(
    sourceDir: string, 
    subdomain: string
): Promise<string> {
    const buildDir = path.join(BUILDS_DIR, subdomain);
    await copyDir(sourceDir, buildDir);
    return buildDir;
}

/**
 * Configura los archivos de entorno para el build
 */
export async function configureEnvironment(
    buildDir: string, 
    siteConfig: Record<string, unknown>
): Promise<void> {
    const envContent = generateEnvContent(siteConfig);
    
    // Crear .env y .env.local para Next.js
    await writeFile(path.join(buildDir, '.env'), envContent);
    await writeFile(path.join(buildDir, '.env.local'), envContent);
}

/**
 * Instala dependencias y compila el proyecto
 */
export async function buildProject(buildDir: string): Promise<void> {
    console.log(`[Deploy] Instalando dependencias en ${buildDir}`);
    await execAsync('npm install', { cwd: buildDir });

    console.log(`[Deploy] Compilando proyecto...`);
    await execAsync('npm run build', { cwd: buildDir });
}

/**
 * Obtiene el directorio de salida del build
 */
export async function getOutputDirectory(buildDir: string): Promise<string | null> {
    const outDir = path.join(buildDir, 'out');
    
    if (await directoryExists(outDir)) {
        return outDir;
    }
    
    return null;
}
