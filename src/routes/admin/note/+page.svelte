<script>
    import { enhance } from '$app/forms';
    export let data;
    
    let isEditing = false;
    let editData = { id: '', title: '', category: 'Kata Nama', file_url: '', cover_image: '' };

    function startEdit(note) {
        isEditing = true;
        editData = { ...note };
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function cancelEdit() {
        isEditing = false;
        editData = { id: '', title: '', category: 'Kata Nama', file_url: '', cover_image: '' };
    }
</script>

<div class="admin-note-container">
    <h1>📁 Pengurusan Koleksi Nota</h1>

    <div class="form-card" class:edit-mode={isEditing}>
        <h3>{isEditing ? '📝 Kemaskini Nota' : '➕ Tambah Nota Baru'}</h3>
        <form method="POST" action="?/manageNote" use:enhance enctype="multipart/form-data">
            {#if isEditing}
                <input type="hidden" name="id" value={editData.id} />
                <input type="hidden" name="current_pdf_url" value={editData.file_url} />
                <input type="hidden" name="current_cover_url" value={editData.cover_image} />
            {/if}

            <div class="input-row">
                <div class="field">
                    <label>Tajuk Nota</label>
                    <input type="text" name="title" bind:value={editData.title} required />
                </div>
                <div class="field">
                    <label>Kategori</label>
                        <select name="category" bind:value={editData.category}>
                            <option value="Sintaksis">Sintaksis</option>
                            <option value="Kata Nama">Kata Nama</option>
                            <option value="Kata Sendi">Kata Sendi</option>
                            <option value="Kata Kerja">Kata Kerja</option>
                            <option value="Kata Adjektif">Kata Adjektif</option>
                            <option value="Ejaan">Ejaan</option> 
                            <option value="Peribahasa">Peribahasa</option>
                            <option value="Ayat Tunggal">Ayat Tunggal</option>
                            <option value="Ayat Majmuk">Ayat Majmuk</option>
                            <option value="Umum">Umum</option>
                        </select>
                </div>
            </div>

            <div class="input-row">
                <div class="field">
                    <label>Fail PDF {isEditing ? '(Biar kosong jika tiada perubahan)' : ''}</label>
                    <input type="file" name="note_pdf" accept=".pdf" required={!isEditing} />
                </div>
                <div class="field">
                    <label>Imej Kulit (Cover) {isEditing ? '(Biar kosong jika tiada perubahan)' : ''}</label>
                    <input type="file" name="cover_image" accept="image/*" />
                </div>
            </div>

            <div class="btn-group">
                <button type="submit" class="save-btn">{isEditing ? 'Simpan Perubahan' : 'Muat Naik Nota'}</button>
                {#if isEditing}
                    <button type="button" class="cancel-btn" on:click={cancelEdit}>Batal</button>
                {/if}
            </div>
        </form>
    </div>

    <div class="note-list">
        <h3>Senarai Nota Sedia Ada ({data?.notes?.length || 0})</h3>
        
        {#each (data?.notes || []) as note (note.id)}
            <div class="admin-note-card">
                <img 
                    src={note.cover_image === 'default-note.png' ? '/default-note.png' : `/uploads/notes/${note.cover_image}`} 
                    alt="cover" 
                    class="note-thumb" 
                />
                
                <div class="note-info">
                    <strong>{note.title}</strong>
                    
                    {#if note.category && note.category.trim() !== ""}
                        <span class="tag">{note.category}</span>
                    {:else}
                        <span class="tag-warning">Tiada Kategori</span>
                    {/if}
                </div>

                <div class="action-btns">
                    <button class="edit-btn" on:click={() => startEdit(note)}>✏️ Edit</button>
                    <form method="POST" action="?/deleteNote" use:enhance>
                        <input type="hidden" name="id" value={note.id} />
                        <button type="submit" class="del-btn">🗑️ Padam</button>
                    </form>
                </div>
            </div>
        {:else}
            <p class="empty-msg">Tiada nota dalam pangkalan data.</p>
        {/each}
    </div>
</div>

<style>
    .admin-note-container { max-width: 900px; margin: 0 auto; padding: 20px; }
    .form-card { background: white; padding: 25px; border-radius: 15px; margin-bottom: 30px; border: 2px solid #e2e8f0; }
    .edit-mode { border-color: #3b82f6; background: #f0f7ff; }
    
    .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
    .field label { display: block; font-weight: bold; margin-bottom: 5px; font-size: 0.9rem; }
    input, select { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; }
    
    .btn-group { display: flex; gap: 10px; margin-top: 20px; }
    .save-btn { flex: 1; background: #10b981; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer; }
    .cancel-btn { background: #64748b; color: white; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; }

    .admin-note-card { background: white; display: flex; align-items: center; padding: 15px; border-radius: 12px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .note-thumb { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; margin-right: 15px; }
    .note-info { flex: 1; }
    .tag { font-size: 0.75rem; background: #3b82f6; color: white; padding: 2px 8px; border-radius: 10px; margin-left: 10px; }
    
    .action-btns { display: flex; gap: 10px; }
    .edit-btn { background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; }
    .del-btn { background: #fee2e2; color: #ef4444; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; }
</style>