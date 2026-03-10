import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const COMFY_API_URL = "http://127.0.0.1:8188";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = process.env.PORT || 3001;

// Настройки CORS для связи с фронтендом (React обычно крутится на локалхосте)
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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

// Эндпоинт получения сгенерированной картинки для новых уровней
app.post('/api/comfy/generate', async (req, res) => {
    try {
        const { telegramId, level } = req.body;
        console.log(`[FILE] Запрос на получение картинки для уровня ${level} от ${telegramId}`);

        if (!telegramId || !level) {
            res.status(400).json({ error: 'В запросе отсутствует Telegram ID или level!' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { telegramId } });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // 1. Удаляем старую картинку из активной папки, если она есть
        if (user.bioImage && user.bioImage.startsWith('/uploads/active_images/')) {
            try {
                // convert '/uploads/active_images/filename.png' to absolute path
                const relativePath = user.bioImage.replace(/^\/uploads\//, '');
                const oldImagePath = path.join(__dirname, '..', 'uploads', relativePath);

                try {
                    await fs.access(oldImagePath);
                    await fs.unlink(oldImagePath);
                    console.log(`[FILE] Старое изображение удалено: ${oldImagePath}`);
                } catch {
                    // Файл мог быть уже удален
                }
            } catch (err) {
                console.log(`[FILE] Ошибка при удалении старого изображения:`, err);
            }
        }

        // 2. Берем картинку из сгенерированных
        const generatedImagesDir = path.join(__dirname, '..', 'uploads', 'generated_images');
        const activeImagesDir = path.join(__dirname, '..', 'uploads', 'active_images');

        const files = await fs.readdir(generatedImagesDir);
        const imageFiles = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

        if (imageFiles.length === 0) {
            console.error('[FILE] Нет доступных сгенерированных изображений');
            res.status(500).json({ error: 'No generated images available' });
            return;
        }

        // Берем случайное изображение из списка (или можно брать первое)
        const randomIndex = Math.floor(Math.random() * imageFiles.length);
        const selectedImage = imageFiles[randomIndex] as string;
        const oldPath = path.join(generatedImagesDir, selectedImage);

        // Переносим в активные
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const newFilename = `${telegramId}_lvl_${level}_${uniqueSuffix}${path.extname(selectedImage)}`;
        const newPath = path.join(activeImagesDir, newFilename);

        await fs.rename(oldPath, newPath);

        const imageUrl = `/uploads/active_images/${newFilename}`;

        // Обновляем БД (на всякий случай, хотя /api/user/save потом тоже сохранит)
        await prisma.user.update({
            where: { telegramId },
            data: {
                bioImage: imageUrl,
                lastGeneratedLevel: level
            }
        });

        console.log(`[FILE] Новое изображение присвоено и перенесено в: ${imageUrl}`);
        res.json({ success: true, imageUrl });

    } catch (error) {
        console.error('[FILE] Общая ошибка:', error);
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
