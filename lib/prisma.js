import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

dotenv.config();

console.log("Database URL:", process.env.DATABASE_URL);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export default prisma;