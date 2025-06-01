import { PrismaClient } from '../../generated/prisma';

// Create a single instance of Prisma client to be used throughout the application
export const prisma = new PrismaClient();
