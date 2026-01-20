export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    roles: string[];
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}