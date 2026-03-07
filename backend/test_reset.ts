import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const result = await prisma.user.updateMany({
        data: {
            level: 0,
            lastGeneratedLevel: 0,
            bioImage: null
        }
    });
    console.log(`Успешно сброшен уровень и данные генерации для ${result.count} игроков.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
