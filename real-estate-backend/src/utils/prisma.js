import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV !== 'production' ? ['query', 'error', 'warn'] : ['error'],
  });
};


const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

// Cache the client on globalThis in EVERY environment, not just development.
// On Vercel a warm serverless instance re-uses this one client instead of
// opening another MySQL connection per invocation, which is what exhausts the
// database's connection limit under any real traffic.
globalForPrisma.prismaGlobal = prisma;

export default prisma;