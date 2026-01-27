export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    roles: UserRole[];
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export enum UserRole {
    ADMIN = 'Admin',
    CASHIER = 'Cashier',
    STOCK_CLERK = 'StockClerk',
    MANAGER = 'Manager',
    ACCOUNTANT = 'Accountant',
}