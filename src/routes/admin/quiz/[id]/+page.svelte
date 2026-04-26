<script>
    import { enhance } from '$app/forms';
    export let data;
</script>

<div class="admin-container">
    <a href="/admin/quiz" class="back-link">⬅️ Kembali ke Senarai Kuiz</a>
    <h1>Urus Soalan: <span class="highlight">{data.topic.title}</span></h1>

    <div class="question-form">
        <h3>Tambah Soalan Objektif</h3>
        <form method="POST" action="?/addQuestion" use:enhance>
            <textarea name="question_text" placeholder="Masukkan soalan di sini..." required></textarea>
            
            <div class="options-grid">
                <div class="opt red"><label>A</label><input type="text" name="opt_a" required /></div>
                <div class="opt blue"><label>B</label><input type="text" name="opt_b" required /></div>
                <div class="opt yellow"><label>C</label><input type="text" name="opt_c" required /></div>
                <div class="opt green"><label>D</label><input type="text" name="opt_d" required /></div>
            </div>

            <div class="correct-selection">
                <label>Jawapan Betul:</label>
                <select name="correct_option">
                    <option value="A">Pilihan A (Merah)</option>
                    <option value="B">Pilihan B (Biru)</option>
                    <option value="C">Pilihan C (Kuning)</option>
                    <option value="D">Pilihan D (Hijau)</option>
                </select>
            </div>
            
            <button type="submit" class="btn-save">💾 Simpan Soalan</button>
        </form>
    </div>

    <div class="question-list">
        <h3>Senarai Soalan ({data.questions.length})</h3>
        {#each data.questions as q, i}
            <div class="q-card">
                <div class="q-header">
                    <strong>Soalan {i + 1}:</strong> {q.question_text}
                    <form method="POST" action="?/deleteQuestion" use:enhance>
                        <input type="hidden" name="id" value={q.id} />
                        <button class="del-btn">Padam</button>
                    </form>
                </div>
                <div class="q-body">
                    <span class:is-correct={q.correct_option === 'A'}>A: {q.option_a}</span>
                    <span class:is-correct={q.correct_option === 'B'}>B: {q.option_b}</span>
                    <span class:is-correct={q.correct_option === 'C'}>C: {q.option_c}</span>
                    <span class:is-correct={q.correct_option === 'D'}>D: {q.option_d}</span>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .admin-container { max-width: 1000px; margin: 0 auto; padding: 30px; }
    .highlight { color: #3b82f6; }
    .back-link { display: inline-block; margin-bottom: 20px; color: #64748b; text-decoration: none; font-weight: bold; }
    
    .question-form { background: #f8fafc; padding: 25px; border-radius: 20px; border: 2px dashed #cbd5e1; margin-bottom: 40px; }
    .question-form textarea { width: 100%; height: 80px; padding: 15px; border-radius: 10px; border: 2px solid #e2e8f0; margin-bottom: 20px; font-size: 1.1rem; }
    
    .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
    .opt { display: flex; align-items: center; padding: 10px; border-radius: 10px; color: white; font-weight: bold; }
    .opt label { margin-right: 15px; font-size: 1.5rem; }
    .opt input { flex: 1; padding: 8px; border-radius: 5px; border: none; }
    
    .red { background: #e21b3c; }
    .blue { background: #1368ce; }
    .yellow { background: #d89e00; }
    .green { background: #26890c; }
    
    .correct-selection { margin-bottom: 20px; font-weight: bold; }
    .correct-selection select { padding: 10px; border-radius: 8px; border: 2px solid #3b82f6; margin-left: 10px; }
    .btn-save { width: 100%; background: #2563eb; color: white; border: none; padding: 15px; border-radius: 12px; font-size: 1.1rem; font-weight: bold; cursor: pointer; }

    .q-card { background: white; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-bottom: 15px; }
    .q-header { display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 10px; }
    .del-btn { background: #fee2e2; color: #ef4444; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; }
    .q-body { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .q-body span { padding: 8px; background: #f1f5f9; border-radius: 6px; font-size: 0.9rem; }
    .is-correct { background: #dcfce7 !important; color: #166534; font-weight: bold; border: 1px solid #22c55e; }
</style>