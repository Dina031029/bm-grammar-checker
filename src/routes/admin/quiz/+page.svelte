<script>
    import { enhance } from '$app/forms';
    export let data;
</script>

<div class="admin-container">
    <h1>⚙️ Pengurusan Quiz</h1>

    <div class="action-card">
        <h3>Cipta Kategori Quiz Baru</h3>
        <form method="POST" action="?/addTopic" use:enhance>
            <input type="text" name="title" placeholder="Tajuk Topik (contoh: Kata Ganti Nama)" required />
            <button type="submit" class="btn-primary">➕ Cipta Topik</button>
        </form>
    </div>

    <div class="topic-grid">
        {#each data.topics as topic}
            <div class="topic-item">
                <span>{topic.title}</span>
                <a href="/admin/quiz/{topic.id}" class="manage-btn">Edit Soalan</a>
            </div>
        {/each}
    </div>
</div>

<style>
    .action-card { background: #f8fafc; padding: 25px; border: 2px dashed #cbd5e1; border-radius: 15px; margin-bottom: 30px; }
    .btn-primary { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
    .topic-item { background: white; padding: 15px 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .manage-btn { color: #ef4444; font-weight: bold; text-decoration: none; }
</style>