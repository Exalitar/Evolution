import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// НАСТРОЙКИ
const RAILWAY_UPLOAD_URL = "https://evolution-production-4313.up.railway.app/api/comfy/upload";
const CHECK_INTERVAL_MS = 10000; // Проверять каждые 10 секунд
const generatedImagesDir = path.join(__dirname, 'uploads', 'generated_images');

console.log(`====================================================`);
console.log(`🚀 ЗАПУЩЕН ЛОКАЛЬНЫЙ ОТПРАВИТЕЛЬ КАРТИНОК COMFYUI`);
console.log(`📁 Папка мониторинга: ${generatedImagesDir}`);
console.log(`🌐 Сервер назначения: ${RAILWAY_UPLOAD_URL}`);
console.log(`====================================================`);

async function checkAndUpload() {
    try {
        // Убеждаемся, что папка существует
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

        if (imageFiles.length === 0) {
            // Тишина, не спамим в консоль
            return;
        }

        console.log(`[LOCAL] Найдено готовых картинок: ${imageFiles.length}. Начинаю отправку первой...`);

        // Берем первую картинку в очереди
        const selectedImage = imageFiles[0];
        const imagePath = path.join(generatedImagesDir, selectedImage);

        // Читаем файл
        const fileBuffer = await fs.readFile(imagePath);

        // Формируем multipart/form-data "вручную" через Blob для fetch
        const formData = new FormData();
        const blob = new Blob([fileBuffer], { type: 'image/png' });
        formData.append('image', blob, selectedImage);

        // Отправляем на Railway
        console.log(`[LOCAL] Загружаю ${selectedImage} на Railway...`);
        const response = await fetch(RAILWAY_UPLOAD_URL, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log(`[LOCAL - УСПЕХ] Картинка ${selectedImage} успешно загружена на Railway!`);

            // Удаляем ее у себя, чтобы ComfyUI сделал новую
            try {
                await fs.unlink(imagePath);
                console.log(`[LOCAL] Локальная копия ${selectedImage} удалена.`);
            } catch (unlinkErr) {
                console.error("[LOCAL] Ошибка удаления файла после отправки: ", unlinkErr);
            }
        } else if (response.status === 429) {
            console.log(`[LOCAL - ОЖИДАНИЕ] Буфер на Railway заполнен (10/10). Жду освобождения места... 😴`);
            // Мы НЕ удаляем файл локально, он отправится в следующий раз
        } else {
            const errText = await response.text();
            console.error(`[LOCAL - ОШИБКА] Railway не принял файл. Статус: ${response.status}`, errText);
        }

    } catch (e) {
        console.error("[LOCAL] Ошибка в цикле отправки:", e.message || e);
    }
}

// Запускаем бесконечный цикл
// setInterval не блокирует выполнение, скрипт будет висеть в памяти
setInterval(checkAndUpload, CHECK_INTERVAL_MS);

// Делаем первую проверку сразу при запуске
checkAndUpload();
