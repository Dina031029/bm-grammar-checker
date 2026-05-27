<script>
    import { enhance } from '$app/forms';
    export let data;
</script>

<div class="container">
    <h1>Pengurusan Quiz</h1>
    
    <div class="box">
        <h3>Cipta Kategori Quiz Baru</h3>
        <form method="POST" action="?/createTopic" use:enhance class="row-form">
            <input type="text" name="title" placeholder="Tajuk Topik (contoh: Kata Kerja)" required />
            <button type="submit" class="btn-primary">➕ Cipta Topik</button>
        </form>
    </div>

    {#each data.topics as topic}
        <div class="quiz-item">
            <span>{topic.title}</span>
            <div class="actions">
                <a href="/admin/quiz/{topic.id}" class="btn-edit">Edit Soalan</a>
                <form method="POST" action="?/deleteTopic" use:enhance>
                    <input type="hidden" name="id" value={topic.id} />
                    <button type="submit" class="btn-delete">Padam Quiz</button>
                </form>
            </div>
        </div>
    {/each}
</div>

<style>
    .container { max-width: 800px; margin: 40px auto; font-family: sans-serif; }
    .box { background: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 30px; }
    .row-form { display: flex; gap: 10px; }
    .quiz-item { display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #eee; align-items: center; }
    .actions { display: flex; gap: 10px; }
    .btn-primary { background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    .btn-edit { background: #10b981; color: white; padding: 5px 10px; text-decoration: none; border-radius: 4px; font-size: 0.9rem; }
    .btn-delete { background: #ef4444; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
</style>