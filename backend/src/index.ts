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

    // Рандомизируем сиды
    if (prompt["4"]?.inputs) prompt["4"].inputs.seed = Math.floor(Math.random() * 1000000000000000);
    if (prompt["43"]?.inputs) prompt["43"].inputs.seed = Math.floor(Math.random() * 1000000000000000);
    if (prompt["152"]?.inputs) prompt["152"].inputs.seed = Math.floor(Math.random() * 1000000000000000);
    if (prompt["228"]?.inputs) prompt["228"].inputs.seed = Math.floor(Math.random() * 1000000000000000);

    const clientId = Math.random().toString(36).substring(2, 15);

    const genRes = await fetch(`${COMFY_API_URL}/prompt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, client_id: clientId }),
    });

    if (!genRes.ok) throw new Error(`[COMFY] Failed to start generation: ${await genRes.text()}`);

    const { prompt_id } = await genRes.json() as { prompt_id: string };

    let isDone = false;
    let imageUrl = null;
    let attempts = 0;
    const maxAttempts = 60; // До 300 секунд

    while (!isDone && attempts < maxAttempts) {
        attempts++;
        // Полинг раз в 5 секунд, чтобы не перегружать туннель
        await new Promise(resolve => setTimeout(resolve, 5000));

        try {
            const historyRes = await fetch(`${COMFY_API_URL}/history/${prompt_id}`);
            if (!historyRes.ok) continue; // Игнорируем временные 502 ошибки Cloudflare
            const history = await historyRes.json() as any;

            if (history[prompt_id]) {
                isDone = true;
                const outputs = history[prompt_id].outputs;

                let outputNode = null;
                if (outputs["235"]) outputNode = outputs["235"];
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

    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) throw new Error("Failed to download image from ComfyUI");

    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return `data:image/png;base64,${buffer.toString('base64')}`;
}

const POOL_TARGET_SIZE = 300;
const POOL_MIN_SIZE = 100;
let isGeneratingBackground = false;

async function checkAndRefillImagePool() {
    if (isGeneratingBackground) return;

    try {
        const unusedCount = await prisma.imagePool.count({
            where: { isUsed: false }
        });

        if (unusedCount < POOL_MIN_SIZE) {
            console.log(`\n[POOL] В пуле ${unusedCount} картинок (меньше порога ${POOL_MIN_SIZE}). Начинаем генерацию до ${POOL_TARGET_SIZE}...`);
            isGeneratingBackground = true;

            const neededCount = POOL_TARGET_SIZE - unusedCount;
            for (let i = 0; i < neededCount; i++) {
                try {
                    console.log(`[POOL] Генерация картинки ${i + 1}/${neededCount} ...`);
                    const base64Image = await generateSingleImage();
                    if (base64Image) {
                        await prisma.imagePool.create({
                            data: { base64: base64Image }
                        });
                        console.log(`[POOL] ✅ Картинка ${i + 1} успешно сохранена в базу! (Всего готово: ${unusedCount + i + 1})`);
                        // Пауза 5 секунд между УСПЕШНЫМИ генерациями, чтобы не душить Cloudflare
                        await new Promise(res => setTimeout(res, 5000));
                    }
                } catch (e) {
                    console.error(`[POOL] ❌ Ошибка генерации картинки (возможно Cloudflare сбрасывает соединение):`, (e as Error).message);
                    // Если Cloudflare ругается или ComfyUI занят - спим 15 секунд перед следующей попыткой
                    console.log(`[POOL] Ждем 15 секунд перед следующей попыткой...`);
                    await new Promise(res => setTimeout(res, 15000));
                }
            }
            console.log(`[POOL] 🎉 Пул пополнен!`);
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

// Эндпоинт выдачи Monster Image из пула
app.post('/api/comfy/generate', async (req, res) => {
    try {
        console.log('[COMFY] Запрос на выдачу картинки из пула');

        // 1. Ищем готовую картинку в БД
        const availableImage = await prisma.imagePool.findFirst({
            where: { isUsed: false }
        });

        if (availableImage) {
            // 2. Маркируем как использованную
            await prisma.imagePool.update({
                where: { id: availableImage.id },
                data: { isUsed: true }
            });
            console.log(`[COMFY] 🖼️ Выдана картинка ID: ${availableImage.id} из пула.`);
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
