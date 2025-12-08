export type Role = 'Admin' | 'User';

export interface Session {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Account {
    id: string;
    userId: string;
    accountId: string;
    providerId: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    accessTokenExpiresAt?: Date | null;
    refreshTokenExpiresAt?: Date | null;
    scope?: string | null;
    idToken?: string | null;
    password?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserAddress {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    address2?: string | null;
    postalCode: string;
    phone: string;
    city: string;
    countryId: string;
    userId: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    password?: string | null;
    role: Role;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
    sessions?: Session[];
    accounts?: Account[];
    address?: UserAddress;
}