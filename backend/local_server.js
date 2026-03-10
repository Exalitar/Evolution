import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3005;

// Путь к папке generated_images на вашем компьютере
// __dirname здесь это папка backend/
const generatedImagesDir = path.join(__dirname, 'uploads', 'generated_images');

app.get('/api/take-image', async (req, res) => {
    try {
        // Проверяем, существует ли папка, и создаем ее, если вдруг нет
        try {
            await fs.access(generatedImagesDir);
        } catch {
            await fs.mkdir(generatedImagesDir, { recursive: true });
        }

        const files = await fs.readdir(generatedImagesDir);

        // Берем только настоящие картинки
        const imageFiles = files.filter(f =>
            f.toLowerCase().endsWith('.png') ||
            f.toLowerCase().endsWith('.jpg') ||
            f.toLowerCase().endsWith('.jpeg')
        );

        console.log(`[LOCAL] Поступил запрос на отдачу картинки. Доступно: ${imageFiles.length}`);

        if (imageFiles.length === 0) {
            return res.status(404).json({ error: 'Нет доступных готовых картинок на ПК!' });
        }

        // Берем случайную картинку из папки
        const randomIndex = Math.floor(Math.random() * imageFiles.length);
        const selectedImage = imageFiles[randomIndex];
        const imagePath = path.join(generatedImagesDir, selectedImage);

        // Отправляем картинку в потоке
        res.download(imagePath, selectedImage, async (err) => {
            if (err) {
                console.error("[LOCAL] Ошибка при отправке картинки: ", err);
            } else {
                // Если отправка прошла успешно — удаляем картинку с компьютера!
                // Это заставит ComfyUI увидеть нехватку файла и сгенерировать новый.
                try {
                    await fs.unlink(imagePath);
                    console.log(`[LOCAL - УСПЕХ] Изображение ${selectedImage} отдано бэкенду и удалено локально.`);
                } catch (unlinkErr) {
                    console.error("[LOCAL] Ошибка удаления файла после отправки: ", unlinkErr);
                }
            }
        });

    } catch (e) {
        console.error("[LOCAL] Внутренняя ошибка сервера: ", e);
        res.status(500).json({ error: 'Внутренняя ошибка сервера ПК' });
    }
});

app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 ЛОКАЛЬНЫЙ РАЗДАТЧИК КАРТИНОК COMFYUI ЗАПУЩЕН`);
    console.log(`📡 Порт: ${PORT}`);
    console.log(`📁 Папка: ${generatedImagesDir}`);
    console.log(`====================================================`);
});
