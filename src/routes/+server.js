import { HUGGINGFACE_TOKEN, HUGGINGFACE_MODEL_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const { text } = await request.json();

        const response = await fetch(HUGGINGFACE_MODEL_URL, {
            headers: { 
                "Authorization": `Bearer ${HUGGINGFACE_TOKEN}`,
                "Content-Type": "application/json",
                "x-use-cache": "false" 
            },
            method: "POST",
            body: JSON.stringify({ 
                inputs: `pembetulan: ${text}`,
                parameters: {
                    max_new_tokens: 150,
                    temperature: 0.1
                },
                options: {
                    wait_for_model: true
                }
            }),
        });

        const result = await response.json();

        // Standard error handling for the new Router
        if (!response.ok) {
            return json({ error: result.error || "Ralat sambungan AI." }, { status: response.status });
        }

        let corrected = result[0]?.generated_text || text;
        corrected = corrected.replace('pembetulan: ', '').trim();

        return json({ 
            corrected,
            explanation: "Skop pembetulan ini adalah untuk memperbaiki kesalahan ejaan, kata sendi nama, dan struktur ayat dalam bahasa Melayu. Model ini dilatih untuk memahami konteks dan memberikan pembetulan yang sesuai dengan gaya bahasa yang betul."
        });
    } catch (err) {
        console.error("Router Error:", err);
        return json({ error: "Gagal menghubungi Router AI." }, { status: 500 });
    }
}