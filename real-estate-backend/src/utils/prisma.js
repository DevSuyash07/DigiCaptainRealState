import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV !== 'production' ? ['query', 'error', 'warn'] : ['error'],
  });
};


const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaGlobal = prisma;
}

export default prisma;