// Exportaciones principales
export { deployWebsite, deployOrderWebsites } from './deploy-website';
export { deleteDeployment } from './delete-deployment';

// Tipos
export type { DeployResult, SiteConfiguration } from './types';
export type { DeploymentStatusType } from './deployment-status';

// Utilidades (para uso interno o testing)
export { generateSubdomain } from './subdomain-generator';
export { generateEnvContent } from './env-generator';
export { updateDeploymentStatus, markDeploymentFailed } from './deployment-status';
export { uploadDirToS3, generateDeploymentUrl } from './s3-client';
export { 
    findTemplateSource, 
    prepareBuildDirectory, 
    configureEnvironment, 
    buildProject,
    getOutputDirectory,
    BUILDS_DIR,
    SOURCES_DIR
} from './template-builder';
export { copyDir, directoryExists, removeDir, writeFile } from './file-utils';
