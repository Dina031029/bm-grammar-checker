<script>
	import { invalidateAll } from '$app/navigation';
	import { onDestroy } from 'svelte';

	export let data;

	let step = 0;
	let questions = [];
	let currentQIdx = 0;
	let score = 0;
	let isLoading = false;
	let feedback = "";

	// AUDIO
	let quizAudio;

	// EXPLANATION
	let showExplanation = false;
	let currentExplanation = '';

	async function startQuiz(topicId) {
		isLoading = true;

		try {
			const res = await fetch(`/api/questions?topicId=${topicId}`);
			questions = await res.json();

			if (questions.length > 0) {
				step = 1;
				currentQIdx = 0;
				score = 0;
				feedback = "";

				// START AUDIO
				if (!quizAudio) {
					quizAudio = new Audio('/audio/quizbgm.mp3');
					quizAudio.loop = true;
					quizAudio.volume = 0.4;
				}

				quizAudio.play();

			} else {
				alert("Kuiz ini belum mempunyai soalan.");
			}

		} catch (err) {
			console.error(err);

		} finally {
			isLoading = false;
		}
	}

	function stopQuizAudio() {
		if (quizAudio) {
			quizAudio.pause();
			quizAudio.currentTime = 0;
		}
	}

	onDestroy(() => {
		stopQuizAudio();
	});

	async function handleAnswer(selectedOption) {

		if (selectedOption === questions[currentQIdx].correct_option) {

			score += 10;
			feedback = "BETUL! 🌟";

		} else {

			feedback = "KURANG TEPAT! ❌";
		}

		setTimeout(async () => {

			feedback = "";

			if (currentQIdx < questions.length - 1) {

				currentQIdx++;

			} else {

				step = 2;

				stopQuizAudio();

				await saveResults();
			}

		}, 1000);
	}

	async function saveResults() {

		try {

			const res = await fetch('/api/update-points', {
				method: 'POST',
				body: JSON.stringify({ points: score }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (res.ok) {
				await invalidateAll();
			}

		} catch (err) {

			console.error("Gagal simpan markah:", err);
		}
	}
</script>

<div class="quiz-wrapper">

	{#if step === 0}

		<div class="welcome-card">
			<h1>🎯 Pilih Topik Kuiz</h1>
			<p>
				Uji kemahiran tatabahasa anda dan kumpul mata!
			</p>
		</div>

		<div class="topic-grid">

			{#each data.topics as topic}

				<button
					class="topic-card"
					on:click={() => startQuiz(topic.id)}
					disabled={isLoading}
				>
					<div class="card-icon">📖</div>

					<h3>{topic.title}</h3>

					<p>
						{topic.description || 'Klik untuk mula menjawab.'}
					</p>

					{#if isLoading}
						<span class="loading-status">
							Memuatkan...
						</span>
					{/if}

				</button>

			{:else}

				<div class="empty-state">
					Tiada kuiz tersedia.
				</div>

			{/each}

		</div>

	{:else if step === 1}

		<div class="quiz-ui">

			<div class="quiz-header">

				<span class="progress-txt">
					Soalan {currentQIdx + 1} / {questions.length}
				</span>

				<span class="score-txt">
					Mata: {score}
				</span>

			</div>

			<div class="question-container">

				<h2 class="question-text">
					{questions[currentQIdx].question_text}
				</h2>

				<button
					class="explain-btn"
					on:click={() => {
						currentExplanation =
							questions[currentQIdx].explanation ||
							'Tiada penerangan disediakan.';

						showExplanation = true;
					}}
				>
					📘 Lihat Penerangan
				</button>

				{#if feedback}

					<div
						class="feedback-overlay"
						class:correct={feedback.includes('BETUL')}
					>
						{feedback}
					</div>

				{/if}

			</div>

			<div class="options-grid">

				<button
					class="opt red"
					on:click={() => handleAnswer('A')}
					disabled={!!feedback}
				>
					<span class="symbol">▲</span>
					{questions[currentQIdx].option_a}
				</button>

				<button
					class="opt blue"
					on:click={() => handleAnswer('B')}
					disabled={!!feedback}
				>
					<span class="symbol">◆</span>
					{questions[currentQIdx].option_b}
				</button>

				<button
					class="opt yellow"
					on:click={() => handleAnswer('C')}
					disabled={!!feedback}
				>
					<span class="symbol">●</span>
					{questions[currentQIdx].option_c}
				</button>

				<button
					class="opt green"
					on:click={() => handleAnswer('D')}
					disabled={!!feedback}
				>
					<span class="symbol">■</span>
					{questions[currentQIdx].option_d}
				</button>

			</div>

		</div>

	{:else}

		<div class="result-card">

			<span class="emoji">🎉</span>

			<h2>Kuiz Tamat!</h2>

			<p class="final-score">
				Markah Anda:
				<span>{score}</span>
			</p>

			<p class="sync-msg">
				Mata telah dikemas kini.
			</p>

			<button
				class="retry-btn"
				on:click={() => {
					step = 0;
					stopQuizAudio();
				}}
			>
				Kembali ke Menu
			</button>

		</div>

	{/if}

	{#if showExplanation}

		<div class="popup-overlay">

			<div class="popup-card">

				<h3>📖 Penerangan Jawapan</h3>

				<p>{currentExplanation}</p>

				<button
					class="close-popup"
					on:click={() => showExplanation = false}
				>
					Tutup
				</button>

			</div>

		</div>

	{/if}

</div>

<style>

.quiz-wrapper {
	max-width: 1000px;
	margin: 0 auto;
	padding: 20px;
}

.welcome-card {
	text-align: center;
	margin-bottom: 40px;
}

.welcome-card h1 {
	font-size: 2.5rem;
	color: #1e293b;
}

.topic-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 20px;
}

.topic-card {
	background: white;
	padding: 30px;
	border-radius: 20px;
	border: none;
	box-shadow: 0 4px 15px rgba(0,0,0,0.1);
	cursor: pointer;
	transition: 0.3s;
	text-align: center;
	border-bottom: 6px solid #3b82f6;
}

.topic-card:hover {
	transform: translateY(-5px);
	background: #f0f7ff;
}

.card-icon {
	font-size: 2.5rem;
	margin-bottom: 10px;
}

.quiz-header {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20px;
	font-weight: bold;
	color: #64748b;
}

.question-container {
	background: white;
	padding: 50px 30px;
	border-radius: 24px;
	text-align: center;
	margin-bottom: 30px;
	box-shadow: 0 10px 25px rgba(0,0,0,0.05);
	position: relative;
}

.question-text {
	font-size: 1.8rem;
	margin: 0;
	color: #1e293b;
}

.feedback-overlay {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: #ef4444;
	color: white;
	padding: 15px 30px;
	border-radius: 50px;
	font-size: 1.5rem;
	font-weight: bold;
	z-index: 10;
}

.feedback-overlay.correct {
	background: #10b981;
}

.options-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 15px;
}

.opt {
	padding: 35px 20px;
	border-radius: 15px;
	border: none;
	color: white;
	font-size: 1.2rem;
	font-weight: bold;
	cursor: pointer;
	transition: 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
}

.opt:hover:not(:disabled) {
	opacity: 0.9;
	transform: scale(1.02);
}

.red {
	background: #e21b3c;
}

.blue {
	background: #1368ce;
}

.yellow {
	background: #d89e00;
}

.green {
	background: #26890c;
}

.result-card {
	text-align: center;
	padding: 60px;
	background: white;
	border-radius: 24px;
	box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.emoji {
	font-size: 4rem;
	display: block;
	margin-bottom: 10px;
}

.final-score {
	font-size: 1.5rem;
}

.final-score span {
	font-size: 3rem;
	font-weight: 900;
	color: #3b82f6;
}

.retry-btn {
	margin-top: 30px;
	background: #1e293b;
	color: white;
	padding: 15px 40px;
	border-radius: 12px;
	font-weight: bold;
	cursor: pointer;
	border: none;
}

.sync-msg {
	color: #64748b;
	font-size: 0.9rem;
	font-style: italic;
}

.explain-btn {
	margin-top: 20px;
	background: #2563eb;
	color: white;
	border: none;
	padding: 10px 18px;
	border-radius: 10px;
	cursor: pointer;
	font-weight: bold;
}

.popup-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0,0,0,0.7);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.popup-card {
	background: white;
	padding: 30px;
	border-radius: 20px;
	max-width: 500px;
	width: 90%;
	text-align: center;
}

.close-popup {
	margin-top: 20px;
	background: #ef4444;
	color: white;
	border: none;
	padding: 10px 20px;
	border-radius: 10px;
	cursor: pointer;
}

</style>