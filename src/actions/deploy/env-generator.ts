'use server';

/**
 * Genera el contenido del archivo .env para la instalación de la plantilla
 */
export function generateEnvContent(siteConfig: Record<string, unknown>): string {
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

    // Campos personalizados (no incluidos en los campos conocidos)
    const knownFields = [
        'siteName', 
        'siteDescription', 
        'primaryColor', 
        'secondaryColor', 
        'logo', 
        'email', 
        'phone', 
        'address', 
        'socialLinks'
    ];
    
    for (const [key, value] of Object.entries(siteConfig)) {
        if (!knownFields.includes(key) && value) {
            const envKey = `NEXT_PUBLIC_${key.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
            envVars.push(`${envKey}="${String(value)}"`);
        }
    }

    return envVars.join('\n');
}
