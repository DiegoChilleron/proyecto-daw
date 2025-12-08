// Better Auth - Extensión de tipos para campos personalizados del User
declare module '@better-auth/core' {
    interface User {
        role: 'Admin' | 'User';
    }
}

export {};
