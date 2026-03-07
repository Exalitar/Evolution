import monsterWorkflow from '../../server/Monster_generation.json';

const COMFY_API_URL = "http://127.0.0.1:8188";

export const generateMonsterImage = async (): Promise<string | null> => {
    try {
        // Создаём глубокую копию, чтобы можно было менять seed
        const prompt = JSON.parse(JSON.stringify(monsterWorkflow));

        // Рандомизируем сиды для генерации новых изображений
        if (prompt["4"] && prompt["4"].inputs) prompt["4"].inputs.seed = Math.floor(Math.random() * 1000000000000000);
        if (prompt["43"] && prompt["43"].inputs) prompt["43"].inputs.seed = Math.floor(Math.random() * 1000000000000000);
        if (prompt["152"] && prompt["152"].inputs) prompt["152"].inputs.seed = Math.floor(Math.random() * 1000000000000000);
        if (prompt["228"] && prompt["228"].inputs) prompt["228"].inputs.seed = Math.floor(Math.random() * 1000000000000000);

        const clientId = Math.random().toString(36).substring(2, 15);

        // Отправляем запрос
        const res = await fetch(`${COMFY_API_URL}/prompt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, client_id: clientId }),
        });

        if (!res.ok) {
            console.error("Failed to start generation", await res.text());
            return null;
        }

        const { prompt_id } = await res.json();
        console.log("Generation started with prompt_id:", prompt_id);

        // Ожидаем завершения генерации (поллинг)
        return await pollForCompletion(prompt_id);

    } catch (err) {
        console.error("Error generating image:", err);
        return null;
    }
};

const pollForCompletion = async (promptId: string): Promise<string | null> => {
    return new Promise((resolve) => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${COMFY_API_URL}/history/${promptId}`);
                const history = await res.json();

                if (history[promptId]) {
                    clearInterval(interval);
                    const outputs = history[promptId].outputs;

                    // Ищем ноду 235 (SaveImage) или 7 (PreviewImage) чтобы забрать картинку
                    let outputNode = null;
                    if (outputs["235"]) outputNode = outputs["235"];
                    else if (outputs["7"]) outputNode = outputs["7"];

                    if (outputNode && outputNode.images && outputNode.images.length > 0) {
                        const imageInfo = outputNode.images[0];
                        // Формируем URL для скачивания изображения
                        const params = new URLSearchParams({
                            filename: imageInfo.filename,
                            subfolder: imageInfo.subfolder || "",
                            type: imageInfo.type
                        });
                        const imageUrl = `${COMFY_API_URL}/view?${params.toString()}`;
                        resolve(imageUrl);
                    } else {
                        console.error("No image found in output");
                        resolve(null);
                    }
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 2000); // Проверяем каждые 2 секунды
    });
};
