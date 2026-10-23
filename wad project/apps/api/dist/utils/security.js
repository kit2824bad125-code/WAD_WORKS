import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}
export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
export function generateAccessToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: '1d',
    });
}
export function generateRefreshToken(payload) {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: '7d',
    });
}
export function verifyAccessToken(token) {
    try {
        return jwt.verify(token, env.JWT_SECRET);
    }
    catch {
        return null;
    }
}
export function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=security.js.map