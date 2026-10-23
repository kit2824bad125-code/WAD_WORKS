import { PrismaClient } from '@prisma/client';
import { env } from './env.js';
let prisma = null;
let isPrismaConnected = false;
try {
    prisma = new PrismaClient({
        datasources: {
            db: {
                url: env.DATABASE_URL,
            },
        },
        log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
}
catch (e) {
    console.warn('[DB] Prisma initialization warning. Running in standalone persistent store mode.');
}
export async function checkDatabaseConnection() {
    if (!prisma)
        return false;
    try {
        // Attempt a lightweight query
        await prisma.$queryRaw `SELECT 1`;
        isPrismaConnected = true;
        console.log('[DB] PostgreSQL connected successfully via Prisma.');
        return true;
    }
    catch (error) {
        isPrismaConnected = false;
        console.log('[DB] PostgreSQL not reachable at DATABASE_URL. FixNear will use the resilient internal data engine with full persistence.');
        return false;
    }
}
export function getPrismaClient() {
    return prisma;
}
export function isDbConnected() {
    return isPrismaConnected;
}
//# sourceMappingURL=db.js.map