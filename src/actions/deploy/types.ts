export interface DeployResult {
    ok: boolean;
    message: string;
    deploymentUrl?: string;
}

export interface SiteConfiguration {
    siteName?: string;
    siteDescription?: string;
    primaryColor?: string;
    secondaryColor?: string;
    logo?: string;
    email?: string;
    phone?: string;
    address?: string;
    socialLinks?: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
        github?: string;
    };
    [key: string]: unknown;
}
