<script>
    import { enhance } from '$app/forms';
    export let data;
    export let form; // Menangkap maklum balas (success/error) daripada server action
    
    let isEditing = false;
    let formElement;
    let editData = { id: '', title: '', category: 'Kata Nama', file_url: '', cover_image: '' };

    function startEdit(note) {
        isEditing = true;
        editData = { ...note };
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function cancelEdit() {
        isEditing = false;
        editData = { id: '', title: '', category: 'Kata Nama', file_url: '', cover_image: '' };
        if (formElement) formElement.reset();
    }

    // Menguruskan intersep borang untuk mengosongkan input fail selepas tindakan selesai
    const handleEnhanceSubmit = () => {
        return async ({ result, update }) => {
            if (result.type === 'success') {
                isEditing = false;
                editData = { id: '', title: '', category: 'Kata Nama', file_url: '', cover_image: '' };
                if (formElement) formElement.reset();
            }
            await update();
        };
    };
</script>

<div class="admin-note-container">
    <h1>📁 Pengurusan Koleksi Nota</h1>

    {#if form?.message}
        <div class="alert-box" class:alert-error={form.error} class:alert-success={form.success}>
            {form.error ? '❌' : '✅'} {form.message}
        </div>
    {/if}

    <div class="form-card" class:edit-mode={isEditing}>
        <h3>{isEditing ? '📝 Kemaskini Nota' : '➕ Tambah Nota Baru'}</h3>
        <form 
            method="POST" 
            action="?/manageNote" 
            bind:this={formElement} 
            use:enhance={handleEnhanceSubmit} 
            enctype="multipart/form-data"
        >
            {#if isEditing}
                <input type="hidden" name="id" value={editData.id} />
                <input type="hidden" name="current_pdf_url" value={editData.file_url} />
                <input type="hidden" name="current_cover_url" value={editData.cover_image} />
            {/if}

            <div class="input-row">
                <div class="field">
                    <label for="title">Tajuk Nota</label>
                    <input type="text" id="title" name="title" bind:value={editData.title} placeholder="Contoh: Nota Penggunaan Kata Sendi 'Di'" required />
                </div>
                <div class="field">
                    <label for="category">Kategori</label>
                    <select id="category" name="category" bind:value={editData.category}>
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
                    <label for="note_pdf">Fail PDF {isEditing ? '(Biar kosong jika tiada perubahan)' : ''}</label>
                    <input type="file" id="note_pdf" name="note_pdf" accept=".pdf" required={!isEditing} />
                </div>
                <div class="field">
                    <label for="cover_image">Imej Kulit (Cover) {isEditing ? '(Biar kosong jika tiada perubahan)' : ''}</label>
                    <input type="file" id="cover_image" name="cover_image" accept="image/*" />
                </div>
            </div>

            <div class="btn-group">
                <button type="submit" class="save-btn">
                    {isEditing ? 'Simpan Perubahan' : 'Muat Naik Nota'}
                </button>
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
                    src={note.cover_image || '/default-note.png'}
                    alt="Kulit Nota" 
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
                    <button type="button" class="edit-btn" on:click={() => startEdit(note)}>✏️ Edit</button>
                    
                    <form 
                        method="POST" 
                        action="?/deleteNote" 
                        use:enhance={({ cancel }) => {
                            if (!confirm(`Adakah anda pasti mahu memadam nota "${note.title}"?`)) cancel();
                        }}
                    >
                        <input type="hidden" name="id" value={note.id} />
                        <button type="submit" class="delete-btn">
                            🗑️ Padam
                        </button>
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
    
    /* Rekabentuk Kotak Alert */
    .alert-box { padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: bold; font-size: 0.95rem; }
    .alert-success { background-color: #d1fae5; color: #065f46; border: 1px solid #10b981; }
    .alert-error { background-color: #fee2e2; color: #991b1b; border: 1px solid #ef4444; }

    .form-card { background: white; padding: 25px; border-radius: 15px; margin-bottom: 30px; border: 2px solid #e2e8f0; transition: all 0.2s ease; }
    .edit-mode { border-color: #3b82f6; background: #f0f7ff; }
    
    .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
    @media (max-width: 600px) { .input-row { grid-template-columns: 1fr; } }
    
    .field label { display: block; font-weight: bold; margin-bottom: 6px; font-size: 0.9rem; color: #334155; }
    input, select { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; background-color: #fff; }
    
    .btn-group { display: flex; gap: 10px; margin-top: 20px; }
    .save-btn { flex: 1; background: #10b981; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
    .save-btn:hover { background: #059669; }
    .cancel-btn { background: #64748b; color: white; border: none; padding: 12px 20px; border-radius: 10px; cursor: pointer; font-weight: bold; }
    .cancel-btn:hover { background: #475569; }

    .admin-note-card { background: white; display: flex; align-items: center; padding: 15px; border-radius: 12px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
    .note-thumb { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; margin-right: 15px; border: 1px solid #e2e8f0; }
    .note-info { flex: 1; display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
    .tag { font-size: 0.75rem; background: #3b82f6; color: white; padding: 3px 10px; border-radius: 20px; font-weight: 600; }
    .tag-warning { font-size: 0.75rem; background: #f59e0b; color: white; padding: 3px 10px; border-radius: 20px; font-weight: 600; }
    
    .action-btns { display: flex; gap: 10px; align-items: center; }
    .edit-btn { background: #3b82f6; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .edit-btn:hover { background: #2563eb; }
    
    /* Diselaraskan dengan nama nama kelas reka bentuk butang padam (Fixed) */
    .delete-btn { background: #fee2e2; color: #ef4444; border: 1px solid #fca5a5; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; }
    .delete-btn:hover { background: #fecaca; }
    .empty-msg { color: #64748b; font-style: italic; text-align: center; margin: 20px 0; }
</style>