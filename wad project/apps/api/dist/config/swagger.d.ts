export declare const swaggerSpec: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
        contact: {
            name: string;
            email: string;
        };
    };
    servers: {
        url: string;
        description: string;
    }[];
    components: {
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
            };
        };
    };
    paths: {
        '/auth/register': {
            post: {
                summary: string;
                tags: string[];
            };
        };
        '/auth/login': {
            post: {
                summary: string;
                tags: string[];
            };
        };
        '/auth/me': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
            };
        };
        '/search/providers': {
            get: {
                summary: string;
                tags: string[];
            };
        };
        '/categories': {
            get: {
                summary: string;
                tags: string[];
            };
        };
        '/services': {
            get: {
                summary: string;
                tags: string[];
            };
        };
        '/providers/{id}': {
            get: {
                summary: string;
                tags: string[];
            };
        };
        '/bookings': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
            };
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
            };
        };
        '/payments/create': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
            };
        };
        '/payments/verify': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
            };
        };
    };
};
//# sourceMappingURL=swagger.d.ts.map