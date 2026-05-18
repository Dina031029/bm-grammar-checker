import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

const WORD_LIMIT = 20;
const MODEL_NAME = 'qwen2-5-0-5b-instruct-xse';

function buildPrompt(text) {
	return `
Anda ialah sistem pembetulan tatabahasa Bahasa Melayu.

Tugas:
Betulkan ayat dari segi:
1. ejaan
2. kata sendi
3. struktur ayat

Peraturan jawapan:
- Jawab SATU ayat sahaja.
- Jangan beri penerangan.
- Jangan ulang soalan.
- Jangan tambah maksud baharu.
- Jangan ubah maksud asal.
- Gunakan Bahasa Melayu standard.
- Betulkan hanya kesalahan yang perlu.

Ayat salah: ${text}
Ayat betul:
`.trim();
}

function addPunctuation(text) {
	let fixed = String(text || '').trim();

	if (!fixed) return '';

	fixed = fixed.replace(/\s+/g, ' ');

	if (!/[.!?]$/.test(fixed)) {
		fixed += '.';
	}

	return fixed.charAt(0).toUpperCase() + fixed.slice(1);
}

function cleanAIOutput(output, fallback) {
	if (!output) return addPunctuation(fallback);

	let cleaned = String(output)
		.replace(/<pad>/gi, '')
		.replace(/<\/s>/gi, '')
		.replace(/<s>/gi, '')
		.replace(/```/g, '')
		.trim();

	if (cleaned.includes('Ayat betul:')) {
		cleaned = cleaned.split('Ayat betul:').pop().trim();
	}

	cleaned = cleaned
		.replace(/^Ayat betul:/i, '')
		.replace(/^Jawapan:/i, '')
		.replace(/^Output:/i, '')
		.replace(/^Corrected:/i, '')
		.replace(/["`]/g, '')
		.trim();

	const lines = cleaned
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean);

	cleaned = lines[0] || fallback;

	const lower = cleaned.toLowerCase();

	const badOutput =
		lower.includes('ayat salah') ||
		lower.includes('input:') ||
		lower.includes('output:') ||
		lower.includes('jawapan:') ||
		lower.includes('berikut') ||
		lower.includes('maaf') ||
		lower.includes('saya tidak') ||
		cleaned.length > 200;

	if (badOutput) {
		return addPunctuation(fallback);
	}

	return addPunctuation(cleaned);
}

function getChatCompletionUrl() {
	const baseUrl = env.HF_ENDPOINT_URL.replace(/\/+$/, '');
	return `${baseUrl}/v1/chat/completions`;
}

async function checkWithHuggingFace(text) {
	if (!env.HF_TOKEN || !env.HF_ENDPOINT_URL) {
		throw new Error('HF_TOKEN atau HF_ENDPOINT_URL belum ditetapkan.');
	}

	const payload = {
		model: MODEL_NAME,
		messages: [
			{
				role: 'system',
				content:
					'Anda ialah penyemak tatabahasa Bahasa Melayu. Jawab dengan satu ayat betul sahaja.'
			},
			{
				role: 'user',
				content: buildPrompt(text)
			}
		],
		max_tokens: 80,
		temperature: 0.1,
		top_p: 0.9,
		stream: false
	};

	const response = await fetch(getChatCompletionUrl(), {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.HF_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});

	const responseText = await response.text();

	console.log('HF URL:', getChatCompletionUrl());
	console.log('HF STATUS:', response.status);
	console.log('HF RESPONSE:', responseText);

	if (!response.ok) {
		throw new Error(`Hugging Face endpoint gagal: ${responseText}`);
	}

	let data;

	try {
		data = JSON.parse(responseText);
	} catch {
		throw new Error(`Response Hugging Face bukan JSON: ${responseText}`);
	}

	return data?.choices?.[0]?.message?.content || '';
}

export async function POST({ request }) {
	try {
		const { text } = await request.json();
		const inputText = text?.trim();

		if (!inputText) {
			return json(
				{ error: 'Sila masukkan teks untuk disemak.' },
				{ status: 400 }
			);
		}

		const wordCount = inputText.split(/\s+/).length;

		if (wordCount > WORD_LIMIT) {
			return json(
				{ error: 'Maksimum 20 patah perkataan sahaja.' },
				{ status: 400 }
			);
		}

		const hfOutput = await checkWithHuggingFace(inputText);
		const corrected = cleanAIOutput(hfOutput, inputText);

		return json({
			original: inputText,
			corrected,
			source: 'huggingface-endpoint',
			model: MODEL_NAME,
			explanation:
				'Sistem menggunakan model AI Hugging Face Inference Endpoint sahaja. Sistem ini juga hanya berfokus kesalahan ejaan, kata sendi, dan struktur ayat.'
		});
	} catch (err) {
		console.error('Checker API Error:', err.message);

		return json(
			{
				error: 'Sistem mengalami masalah semasa menyemak ayat.',
				details: err.message
			},
			{ status: 500 }
		);
	}
}