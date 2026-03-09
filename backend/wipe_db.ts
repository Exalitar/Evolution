import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function wipe() {
    try {
        await prisma.imagePool.deleteMany();
        console.log('ImagePool successfully cleared.');
        await prisma.user.deleteMany();
        console.log('Users successfully cleared.');
    } catch (e) {
        console.error('Error during wipe:', e);
    } finally {
        process.exit(0);
    }
}

wipe();
