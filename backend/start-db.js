import { execSync } from 'child_process';

console.log('[STARTUP] Initializing database connection...');

let retries = 12; // Ждем до 60 секунд (12 попыток по 5 секунд)
while (retries > 0) {
    try {
        console.log(`[STARTUP] Attempting to update database schema... (${retries} attempts left)`);
        // Используем db push, так как база полностью новая
        execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
        console.log('[STARTUP] Database schema updated successfully!');
        process.exit(0); // Успешно выходим
    } catch (error) {
        console.error('[STARTUP] Database not ready yet or unreachable. Waiting 5 seconds...');
        // Кроссплатформенный sleep на 5 секунд
        execSync('node -e "setTimeout(()=>{}, 5000)"');
        retries--;
    }
}

console.error('[STARTUP] Failed to connect to database after 60 seconds. Exiting.');
process.exit(1);
