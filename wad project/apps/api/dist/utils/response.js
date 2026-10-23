export function sendSuccess(res, data, message, statusCode = 200) {
    const body = {
        success: true,
        message,
        data,
    };
    return res.status(statusCode).json(body);
}
export function sendError(res, code, message, statusCode = 400, details) {
    const body = {
        success: false,
        error: {
            code,
            message,
            details,
        },
    };
    return res.status(statusCode).json(body);
}
export function sendPaginated(res, data, pagination, message, statusCode = 200) {
    const body = {
        success: true,
        data,
        pagination,
    };
    return res.status(statusCode).json(body);
}
//# sourceMappingURL=response.js.map