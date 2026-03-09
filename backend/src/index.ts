import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMFY_API_URL = (process.env.COMFY_API_URL || "http://127.0.0.1:8188").trim().replace(/\/$/, "");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = process.env.PORT || 3001;

// Настройки CORS для связи с фронтендом (React обычно крутится на локалхосте)
app.use(cors());
app.use(express.json());

// Главный маршрут (Эндпоинт) для входа в игру или обновления после перезагрузки
app.post('/api/user/sync', async (req, res) => {
    try {
        const { telegramId } = req.body;
        console.log(`\n[SYNC] Запрос данных для ${telegramId}`);

        if (!telegramId) {
            res.status(400).json({ error: 'В запросе отсутствует Telegram ID!' });
            return;
        }

        let user = await prisma.user.findUnique({
            where: { telegramId },
            include: { stats: true }
        });

        if (!user) {
            console.log(`[SYNC] Создаем новый профиль для ${telegramId}...`);
            user = await prisma.user.create({
                data: {
                    telegramId,
                    stats: { create: {} }
                },
                include: { stats: true }
            });
        } else {
            console.log(`[SYNC] Профиль загружен: level=${user.level}, materialsPoolSize=${user.currentMaterialPool ? 'yes' : 'no'}`);
        }

        res.json(user);

    } catch (error) {
        console.error('[SYNC] Ошибка:', error);
        res.status(500).json({ error: 'Database Error' });
    }
});

// Маршрут для сохранения прогресса после скрещивания
app.post('/api/user/save', async (req, res) => {
    try {
        const { telegramId, level, ep, evolutionStage, totalSynthesisCount, usedMaterials, stats, currentMaterialPool, equipmentData, bioImage, lastGeneratedLevel } = req.body;

        console.log(`\n[SAVE] Сохранение прогресса для ${telegramId}`);
        console.log(`[SAVE] level: ${level}, ep: ${ep}, stage: ${evolutionStage}, totalSynths: ${totalSynthesisCount}`);
        console.log(`[SAVE] hasPool: ${!!currentMaterialPool}, hasEquip: ${!!equipmentData}`);

        if (!telegramId) {
            res.status(400).json({ error: 'В запросе отсутствует Telegram ID!' });
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { telegramId },
            data: {
                level,
                ep,
                evolutionStage,
                totalSynthesisCount,
                usedMaterials,
                currentMaterialPool: currentMaterialPool || undefined,
                equipmentData: equipmentData || undefined,
                bioImage: bioImage !== undefined ? bioImage : undefined,
                lastGeneratedLevel: lastGeneratedLevel !== undefined ? lastGeneratedLevel : undefined,
                stats: {
                    update: {
                        strikePower: stats.strikePower || 0,
                        bioResource: stats.bioResource || 0,
                        defKinetic: stats.defenseMatrix?.kinetic || 0,
                        defEnergy: stats.defenseMatrix?.energy || 0,
                        defBio: stats.defenseMatrix?.bio || 0,
                        defToxic: stats.defenseMatrix?.toxic || 0,
                        defPsionic: stats.defenseMatrix?.psionic || 0,
                        defTech: stats.defenseMatrix?.tech || 0,
                        blockChance: stats.reactiveDefense?.mitigationChance || 0,
                        blockMitigation: stats.reactiveDefense?.mitigationValue || 0,
                        critChance: stats.critPotential?.critChance || 0,
                        critMultiplier: stats.critPotential?.critMultiplier || 1.0,
                        lifestealPercent: stats.predatoryResonance?.lifestealPercent || 0,
                        lifestealChance: stats.predatoryResonance?.lifestealChance || 0,
                        dotDamage: stats.toxicity?.dotDamage || 0,
                        dotChance: stats.toxicity?.dotChance || 0,
                        stunChance: stats.neuroShock?.stunChance || 0,
                        stunDuration: stats.neuroShock?.stunDuration || 0,
                        stunCooldown: stats.neuroShock?.stunCooldown || 0,
                    }
                }
            },
            include: { stats: true }
        });

        console.log(`[SAVE] Успешно сохранено: level=${updatedUser.level}`);
        res.json({ success: true, user: updatedUser });

    } catch (error) {
        console.error('[SAVE] Ошибка при сохранении:', error);
        res.status(500).json({ error: 'Database Error' });
    }
});

async function generateSingleImage(): Promise<string | null> {
    const workflowPath = path.join(__dirname, '..', 'Monster_generation.json');
    const workflowContent = await fs.readFile(workflowPath, 'utf8');
    const prompt = JSON.parse(workflowContent);

    // Рандомизируем сиды для новой схемы
    if (prompt["260"]?.inputs) prompt["260"].inputs.seed = Math.floor(Math.random() * 1000000000000000);
    if (prompt["262"]?.inputs) prompt["262"].inputs.seed = Math.floor(Math.random() * 1000000000000000);

    // Рандомизируем сиды для старой схемы (на случай отката)
    if (prompt["4"]?.inputs) prompt["4"].inputs.seed = Math.floor(Math.random() * 1000000000000000);
    if (prompt["43"]?.inputs) prompt["43"].inputs.seed = Math.floor(Math.random() * 1000000000000000);
    if (prompt["152"]?.inputs) prompt["152"].inputs.seed = Math.floor(Math.random() * 1000000000000000);

    const clientId = Math.random().toString(36).substring(2, 15);

    const genRes = await fetch(`${COMFY_API_URL}/prompt`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Bypass-Tunnel-Reminder": "true"
        },
        body: JSON.stringify({ prompt, client_id: clientId }),
    });

    if (!genRes.ok) throw new Error(`[COMFY] Failed to start generation: ${await genRes.text()}`);

    const { prompt_id } = await genRes.json() as { prompt_id: string };

    let isDone = false;
    let imageUrl = null;
    let attempts = 0;
    const maxAttempts = 120; // До 600 секунд (10 минут)

    while (!isDone && attempts < maxAttempts) {
        attempts++;
        // Полинг раз в 5 секунд, чтобы не перегружать туннель
        await new Promise(resolve => setTimeout(resolve, 5000));

        try {
            const historyRes = await fetch(`${COMFY_API_URL}/history/${prompt_id}`, {
                headers: { "Bypass-Tunnel-Reminder": "true" }
            });
            if (!historyRes.ok) continue; // Игнорируем временные 502 ошибки
            const history = await historyRes.json() as any;

            if (history[prompt_id]) {
                isDone = true;
                const outputs = history[prompt_id].outputs;

                let outputNode = null;
                if (outputs["257"]) outputNode = outputs["257"];
                else if (outputs["258"]) outputNode = outputs["258"];
                else if (outputs["235"]) outputNode = outputs["235"];
                else if (outputs["7"]) outputNode = outputs["7"];

                if (outputNode && outputNode.images && outputNode.images.length > 0) {
                    const imageInfo = outputNode.images[0];
                    const params = new URLSearchParams({
                        filename: imageInfo.filename,
                        subfolder: imageInfo.subfolder || "",
                        type: imageInfo.type
                    });
                    imageUrl = `${COMFY_API_URL}/view?${params.toString()}`;
                }
            }
        } catch (pollError) {
            // Игнорируем сетевые ошибки сброса соединения
            continue;
        }
    }

    if (!imageUrl) throw new Error('[COMFY] Timeout or image missing in history');

    const imgRes = await fetch(imageUrl, {
        headers: { "Bypass-Tunnel-Reminder": "true" }
    });
    if (!imgRes.ok) throw new Error("Failed to download image from ComfyUI");

    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return `data:image/png;base64,${buffer.toString('base64')}`;
}

async function getComfyUIStatus(): Promise<{ queueSize: number, historySize: number }> {
    try {
        const queueRes = await fetch(`${COMFY_API_URL}/queue`, { headers: { "Bypass-Tunnel-Reminder": "true" } });
        const queueData = await queueRes.json() as any;
        const queueSize = (queueData.queue_running?.length || 0) + (queueData.queue_pending?.length || 0);

        const historyRes = await fetch(`${COMFY_API_URL}/history`, { headers: { "Bypass-Tunnel-Reminder": "true" } });
        const historyData = await historyRes.json() as any;
        const historySize = Object.keys(historyData).length;

        return { queueSize, historySize };
    } catch (e) {
        console.error("[COMFY] Error checking status:", e);
        return { queueSize: 0, historySize: 0 };
    }
}

const POOL_TARGET_SIZE = 300;
const POOL_MIN_SIZE = 250; // Увеличили порог до 250
let isGeneratingBackground = false;
let shouldAbortGeneration = false;

async function checkAndRefillImagePool() {
    if (isGeneratingBackground) return;

    try {
        let unusedCount = await prisma.imagePool.count({
            where: { isUsed: false }
        });

        if (unusedCount < POOL_MIN_SIZE) {
            console.log(`\n[POOL] В пуле ${unusedCount} картинок (меньше порога ${POOL_MIN_SIZE}). Начинаем генерацию до ${POOL_TARGET_SIZE}...`);
            isGeneratingBackground = true;

            let successfulGenerations = 0;
            const neededCount = POOL_TARGET_SIZE - unusedCount;

            let aborted = false;
            while (successfulGenerations < neededCount) {
                if (shouldAbortGeneration) {
                    console.log(`[POOL] 🛑 Генерация прервана по запросу очистки пула!`);
                    aborted = true;
                    shouldAbortGeneration = false;
                    break;
                }

                try {
                    const status = await getComfyUIStatus();
                    let currentTotal = unusedCount + successfulGenerations;
                    console.log(`[COMFY] В истории ComfyUI всего сгенерировано: ${status.historySize} картинок. В базе свободно: ${currentTotal}. Очередь ${status.queueSize > 0 ? `занята (${status.queueSize})` : 'пуста'}.`);

                    if (status.queueSize > 0) {
                        console.log(`[POOL] ComfyUI занят (в очереди ${status.queueSize} задач). Ждем 15 секунд...`);
                        await new Promise(res => setTimeout(res, 15000));
                        continue;
                    }

                    console.log(`[POOL] Генерация картинки ${currentTotal + 1}/${POOL_TARGET_SIZE} ...`);
                    const base64Image = await generateSingleImage();

                    if (shouldAbortGeneration) {
                        aborted = true;
                        shouldAbortGeneration = false;
                        break;
                    }

                    if (base64Image) {
                        await prisma.imagePool.create({
                            data: { base64: base64Image }
                        });
                        successfulGenerations++;
                        currentTotal = unusedCount + successfulGenerations;
                        console.log(`[POOL] ✅ Картинка успешно сохранена в базу! (Всего готово: ${currentTotal}/${POOL_TARGET_SIZE})`);

                        if (successfulGenerations >= neededCount) break;

                        // Пауза 5 секунд между УСПЕШНЫМИ генерациями, чтобы не душить туннель
                        await new Promise(res => setTimeout(res, 5000));
                    }
                } catch (e) {
                    console.error(`[POOL] ❌ Ошибка генерации картинки (вероятно сброс туннеля):`, (e as Error).message);
                    // Если туннель ругается или ComfyUI занят - спим 15 секунд перед следующей попыткой
                    console.log(`[POOL] Ждем 15 секунд перед следующей попыткой...`);
                    await new Promise(res => setTimeout(res, 15000));
                }
            }
            if (!aborted) {
                console.log(`[POOL] 🎉 Пул пополнен!`);
            }
        } else {
            console.log(`[POOL] В пуле достаточно картинок (${unusedCount}/${POOL_TARGET_SIZE}). Генерация не требуется.`);
        }
    } catch (e) {
        console.error(`[POOL] Ошибка проверки пула:`, e);
    } finally {
        isGeneratingBackground = false;
    }
}

// Запускаем проверку каждые 60 секунд
setInterval(checkAndRefillImagePool, 60000);
// Первый запуск при старте бэкенда
setTimeout(checkAndRefillImagePool, 5000);

// Эндпоинт очистки пула
app.get('/api/comfy/reset-pool', async (req, res) => {
    try {
        shouldAbortGeneration = true; // Останавливаем текущий зацикленный процесс генерации

        let retries = 3;
        while (retries > 0) {
            try {
                await prisma.imagePool.deleteMany();
                break;
            } catch (err) {
                retries--;
                if (retries === 0) throw err;
                console.warn(`[POOL] Сбой соединения при очистке (осталось попыток: ${retries}). Пробуем снова...`);
                await new Promise(r => setTimeout(r, 1000));
            }
        }
        res.send('Пул картинок успешно очищен! Можно закрывать эту страницу. Бэкенд начнет генерацию новых.');
    } catch (e) {
        console.error('Ошибка очистки пула:', e);
        res.status(500).send('Ошибка при очистке пула');
    }
});

// Эндпоинт выдачи Monster Image из пула
app.post('/api/comfy/generate', async (req, res) => {
    try {
        console.log('[COMFY] Запрос на выдачу картинки из пула');

        // 1. Ищем готовую свободную картинку в БД (самую старую)
        const availableImage = await prisma.imagePool.findFirst({
            where: { isUsed: false },
            orderBy: { createdAt: 'asc' } // Берем по очереди самую старую из пула
        });

        if (availableImage) {
            // 2. Отдаем картинку игроку и СРАЗУ УДАЛЯЕМ её из пула (банку),
            // потому что теперь она будет храниться у самого игрока в его профиле (User.bioImage).
            // Таким образом мы не засоряем базу использованными картинками!
            await prisma.imagePool.delete({
                where: { id: availableImage.id }
            });
            console.log(`[COMFY] 🖼️ Выдана картинка ID: ${availableImage.id} из пула, оригинал удален для экономии места.`);
            res.json({ success: true, base64: availableImage.base64 });
        } else {
            console.warn('[COMFY] ⚠️ В пуле нет свободных картинок! Начинаем генерацию на лету (fallback)...');
            const base64 = await generateSingleImage();
            res.json({ success: true, base64 });
        }

    } catch (error) {
        console.error('[COMFY] Общая ошибка:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ВРЕМЕННЫЙ ЭНДПОИНТ ДЛЯ СБРОСА ВСЕХ ИГРОКОВ
app.get('/api/user/wipe', async (req, res) => {
    try {
        await prisma.user.deleteMany({});
        console.log('[WIPE] Все данные игроков успешно удалены из базы.');
        res.json({ success: true, message: 'All users wiped' });
    } catch (error) {
        console.error('[WIPE] Ошибка:', error);
        res.status(500).json({ error: 'Database Wipe Error' });
    }
});

app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Бэкенд сервер успешно запущен!`);
    console.log(`📡 Ожидаем подключения фронтенда на http://localhost:${PORT}`);
    console.log(`=========================================`);
});
