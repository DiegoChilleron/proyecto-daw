'use server';

/**
 * Genera un subdominio único basado en el nombre del sitio y el ID del pedido
 * 
 * @param siteName - Nombre del sitio proporcionado por el cliente
 * @param orderId - ID único del OrderItem
 * @returns Subdominio único en formato slug
 */
export function generateSubdomain(siteName: string, orderId: string): string {
    const slug = siteName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^a-z0-9]+/g, '-')      // Reemplazar caracteres especiales por guiones
        .replace(/^-|-$/g, '')             // Eliminar guiones al inicio y final
        .substring(0, 30);                 // Limitar longitud
    
    const shortId = orderId.substring(0, 8);
    return `${slug}-${shortId}`;
}
