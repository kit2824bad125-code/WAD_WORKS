import { UserRole } from '@fixnear/shared';
export interface TokenPayload {
    userId: string;
    email: string;
    role: UserRole;
    name: string;
}
export declare function hashPassword(password: string): Promise<string>;
export declare function comparePassword(password: string, hash: string): Promise<boolean>;
export declare function generateAccessToken(payload: TokenPayload): string;
export declare function generateRefreshToken(payload: TokenPayload): string;
export declare function verifyAccessToken(token: string): TokenPayload | null;
export declare function verifyRefreshToken(token: string): TokenPayload | null;
//# sourceMappingURL=security.d.ts.map