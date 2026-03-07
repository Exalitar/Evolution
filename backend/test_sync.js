import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const deleteDevUser = async () => {
    try {
        await prisma.user.deleteMany({});
        console.log("All DB records have been successfully deleted.");
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
};

deleteDevUser();
