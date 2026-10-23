import { sendError } from '../utils/response.js';
export function errorHandler(err, req, res, next) {
    console.error(`[Error] ${req.method} ${req.path}:`, err);
    const statusCode = err.status || err.statusCode || 500;
    const code = err.code || 'INTERNAL_SERVER_ERROR';
    const message = err.message || 'An unexpected error occurred. Please try again later.';
    sendError(res, code, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : undefined);
}
//# sourceMappingURL=error.middleware.js.map