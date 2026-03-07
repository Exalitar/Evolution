import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const prisma = new PrismaClient();

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

async function main() {
    try {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        const prisma = new PrismaClient({ adapter });

        console.log("Connecting...");
        const user = await prisma.user.findUnique({
            where: { telegramId: "dev_user_123" },
            include: { stats: true }
        });
        console.log("Success:", user);
    } catch (e) {
        console.error("Prisma Error:", e);
    }
}

main();
