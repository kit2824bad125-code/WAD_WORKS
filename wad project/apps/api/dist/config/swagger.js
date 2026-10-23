export const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'FixNear REST API',
        version: '1.0.0',
        description: 'Production REST API for FixNear - Two-sided local services marketplace in India',
        contact: {
            name: 'FixNear Engineering',
            email: 'dev@fixnear.dev',
        },
    },
    servers: [
        {
            url: '/api/v1',
            description: 'API v1 Root',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    paths: {
        '/auth/register': {
            post: {
                summary: 'Register a new customer or service provider',
                tags: ['Auth'],
            },
        },
        '/auth/login': {
            post: {
                summary: 'Log in with email and password',
                tags: ['Auth'],
            },
        },
        '/auth/me': {
            get: {
                summary: 'Get currently authenticated user details and profile',
                tags: ['Auth'],
                security: [{ bearerAuth: [] }],
            },
        },
        '/search/providers': {
            get: {
                summary: 'Geospatial provider search with multi-factor ranking score',
                tags: ['Search'],
            },
        },
        '/categories': {
            get: {
                summary: 'List all active service categories',
                tags: ['Categories'],
            },
        },
        '/services': {
            get: {
                summary: 'List all standard services',
                tags: ['Services'],
            },
        },
        '/providers/{id}': {
            get: {
                summary: 'Get detailed public provider profile and customer reviews',
                tags: ['Providers'],
            },
        },
        '/bookings': {
            post: {
                summary: 'Create a new service booking request',
                tags: ['Bookings'],
                security: [{ bearerAuth: [] }],
            },
            get: {
                summary: 'List bookings for the authenticated user',
                tags: ['Bookings'],
                security: [{ bearerAuth: [] }],
            },
        },
        '/payments/create': {
            post: {
                summary: 'Create a Razorpay payment order',
                tags: ['Payments'],
                security: [{ bearerAuth: [] }],
            },
        },
        '/payments/verify': {
            post: {
                summary: 'Verify Razorpay payment signature server-side',
                tags: ['Payments'],
                security: [{ bearerAuth: [] }],
            },
        },
    },
};
//# sourceMappingURL=swagger.js.map