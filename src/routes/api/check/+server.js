import { json } from '@sveltejs/kit';
import { HUGGINGFACE_TOKEN, HF_MODEL_URL } from '$env/static/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    try {
        const { text } = await request.json();

        // 1. Validation
        if (!text || text.trim().length === 0) {
            return json({ error: "Sila masukkan teks untuk disemak." }, { status: 400 });
        }

        const prompt = `
        <start_of_turn>user
        [SISTEM: ENJIN TATABAHASA MELAYU DBP V3]
        Tugas: Anda adalah sistem pemprosesan bahasa semula jadi yang pakar dalam Tatabahasa Dewan (DBP).
        Analisis dan betulkan sebarang input teks berdasarkan hukum berikut:

        HUKUM PEMBETULAN:
        1. MORFOLOGI: Betulkan ejaan, imbuhan (meN-, di-, ter-), dan singkatan (sya/mkn/yg).
        2. SINTAKSIS: Pastikan ayat mengikut pola FN+FN, FN+FK, FN+FA, atau FN+FS. Tambah kata kerja penguat (menaiki, menjalankan) jika perlu untuk kelancaran.
        3. KATA SENDI: Pastikan 'di' (tempat), 'ke' (arah/tempat), dan 'pada' (masa/orang) digunakan dengan tepat mengikut konteks.
        4. SEMANTIK: Kekalkan maksud asal ayat tetapi dalam bentuk formal/gramatis.

        ARAHAN TEKNIKAL:
        - Terima sebarang input bahasa Melayu (formal atau slanga).
        - Hasil output mestilah ayat yang telah dibetulkan SAHAJA.
        - Jangan berikan ulasan atau pengenalan.

        Teks untuk diproses: "${text}"<end_of_turn>
        <start_of_turn>model
        `.trim();

        // 2. Fetch from Hugging Face
        const response = await fetch(HF_MODEL_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HUGGINGFACE_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    temperature: 0.0, // Set to 0.0 for maximum accuracy
                    max_new_tokens: 500, // Increased to allow for 150-word inputs
                    repetition_penalty: 1.1,
                    do_sample: false
                },
                options: { 
                    wait_for_model: true,   
                    use_cache: true           
                }
            })
        });

const result = await response.json();

        // 4. API Error Handling
        if (result.error) {
            console.error("HF API Error:", result.error);
            return json({ error: `Ralat Model: ${result.error}` }, { status: 500 });
        }

        // 5. Extract and Clean Output
// 5. Extract and Clean Output
        let modelOutput = "";
        if (Array.isArray(result) && result[0]?.generated_text) {
            modelOutput = result[0].generated_text;
        } else if (result?.generated_text) {
            modelOutput = result.generated_text;
        }

        let cleanOutput = modelOutput
            .split('<start_of_turn>model').pop() 
            .replace(/<end_of_turn>|<start_of_turn>|model|user/g, "") 
            .replace(/\[.*?\]/g, "") 
            .trim();

        // If the model repeated the user's input, we split it and take the last part
        if (cleanOutput.includes("\n")) {
            const lines = cleanOutput.split("\n").filter(line => line.trim() !== "");
            cleanOutput = lines[lines.length - 1]; 
        }

        // Rmove any remaining technical characters
        cleanOutput = cleanOutput.replace(/[<>]/g, "").trim();

        // Auto-capitalize first letter
        if (cleanOutput.length > 0) {
            cleanOutput = cleanOutput.charAt(0).toUpperCase() + cleanOutput.slice(1);
        }

        // 6. Return only the correction
        return json({
            original: text,
            corrected: cleanOutput || text,
            explanation: "" // Left empty as requested
        });

    } catch (err) {
        console.error("CRITICAL SERVER ERROR:", err);
        return json({ error: "Sistem mengalami masalah dalaman." }, { status: 500 });
    }
}