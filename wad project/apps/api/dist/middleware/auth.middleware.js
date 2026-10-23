import { verifyAccessToken } from '../utils/security.js';
import { sendError } from '../utils/response.js';
export function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendError(res, 'UNAUTHORIZED', 'Authentication token required', 401);
        return;
    }
    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);
    if (!payload) {
        sendError(res, 'INVALID_TOKEN', 'Token is expired or invalid', 401);
        return;
    }
    req.user = payload;
    next();
}
export function requireRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            sendError(res, 'UNAUTHORIZED', 'Authentication required', 401);
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            sendError(res, 'FORBIDDEN', `Access denied. Requires one of: ${allowedRoles.join(', ')}`, 403);
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map