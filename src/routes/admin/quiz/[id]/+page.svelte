<script>

	export let data;

	let isEditing = false;

	let formData = {
		id: '',
		question_text: '',
		option_a: '',
		option_b: '',
		option_c: '',
		option_d: '',
		correct_option: 'A',
		explanation: ''
	};

	function startEdit(q) {

		isEditing = true;

		formData = {
			id: q.id,
			question_text: q.question_text,
			option_a: q.option_a,
			option_b: q.option_b,
			option_c: q.option_c,
			option_d: q.option_d,
			correct_option: q.correct_option,
			explanation: q.explanation || ''
		};

		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	function resetForm() {

		isEditing = false;

		formData = {
			id: '',
			question_text: '',
			option_a: '',
			option_b: '',
			option_c: '',
			option_d: '',
			correct_option: 'A',
			explanation: ''
		};
	}
</script>

<div class="admin-wrapper">

	<h1>🛠️ Pengurusan Soalan Kuiz</h1>

	<form
		method="POST"
		action={isEditing ? '?/updateQuestion' : '?/addQuestion'}
		class="quiz-form"
	>

		{#if isEditing}
			<input type="hidden" name="id" value={formData.id} />
		{/if}

		<label>Soalan</label>

		<textarea
			name="question_text"
			bind:value={formData.question_text}
			required
		></textarea>

		<div class="grid">

			<input
				type="text"
				name="option_a"
				placeholder="Pilihan A"
				bind:value={formData.option_a}
				required
			/>

			<input
				type="text"
				name="option_b"
				placeholder="Pilihan B"
				bind:value={formData.option_b}
				required
			/>

			<input
				type="text"
				name="option_c"
				placeholder="Pilihan C"
				bind:value={formData.option_c}
				required
			/>

			<input
				type="text"
				name="option_d"
				placeholder="Pilihan D"
				bind:value={formData.option_d}
				required
			/>

		</div>

		<label>Jawapan Betul</label>

		<select
			name="correct_option"
			bind:value={formData.correct_option}
		>
			<option value="A">A</option>
			<option value="B">B</option>
			<option value="C">C</option>
			<option value="D">D</option>
		</select>

		<label>Penerangan Jawapan</label>

		<textarea
			name="explanation"
			bind:value={formData.explanation}
			placeholder="Masukkan penerangan jawapan..."
		></textarea>

		<div class="btn-group">

			<button type="submit" class="save-btn">

				{#if isEditing}
					Update Soalan
				{:else}
					Tambah Soalan
				{/if}

			</button>

			<button
				type="button"
				class="reset-btn"
				on:click={resetForm}
			>
				Reset
			</button>

		</div>

	</form>

	<hr />

	<div class="question-list">

		{#each data.questions as q}

			<div class="question-card">

				<h3>{q.question_text}</h3>

				<ul>
					<li>A. {q.option_a}</li>
					<li>B. {q.option_b}</li>
					<li>C. {q.option_c}</li>
					<li>D. {q.option_d}</li>
				</ul>

				<p class="correct-answer">
					Jawapan Betul: {q.correct_option}
				</p>

				<p class="explanation">
					📘 {q.explanation}
				</p>

				<div class="actions">

					<button
						type="button"
						class="edit-btn"
						on:click={() => startEdit(q)}
					>
						Edit
					</button>

					<form method="POST" action="?/deleteQuestion">

						<input
							type="hidden"
							name="id"
							value={q.id}
						/>

						<button class="delete-btn">
							Padam
						</button>

					</form>

				</div>

			</div>

		{/each}

	</div>

</div>

<style>

.admin-wrapper {
	max-width: 1000px;
	margin: auto;
	padding: 30px;
}

.quiz-form {
	background: white;
	padding: 30px;
	border-radius: 20px;
	box-shadow: 0 5px 15px rgba(0,0,0,0.1);
	margin-bottom: 40px;
}

.quiz-form textarea,
.quiz-form input,
.quiz-form select {
	width: 100%;
	padding: 14px;
	margin-top: 10px;
	margin-bottom: 20px;
	border-radius: 10px;
	border: 2px solid #e2e8f0;
	box-sizing: border-box;
}

.quiz-form textarea {
	min-height: 120px;
}

.grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 15px;
}

.btn-group {
	display: flex;
	gap: 10px;
}

.save-btn {
	flex: 1;
	background: #10b981;
	color: white;
	border: none;
	padding: 14px;
	border-radius: 12px;
	font-weight: bold;
	cursor: pointer;
}

.reset-btn {
	background: #64748b;
	color: white;
	border: none;
	padding: 14px 20px;
	border-radius: 12px;
	cursor: pointer;
}

.question-list {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.question-card {
	background: white;
	padding: 25px;
	border-radius: 18px;
	box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

.correct-answer {
	font-weight: bold;
	color: #2563eb;
}

.explanation {
	margin-top: 10px;
	color: #475569;
}

.actions {
	display: flex;
	gap: 10px;
	margin-top: 20px;
}

.edit-btn {
	background: #2563eb;
	color: white;
	border: none;
	padding: 10px 18px;
	border-radius: 10px;
	cursor: pointer;
}

.delete-btn {
	background: #ef4444;
	color: white;
	border: none;
	padding: 10px 18px;
	border-radius: 10px;
	cursor: pointer;
}

</style>