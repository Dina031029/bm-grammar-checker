<script>
    export let data;

    $: notes = data?.notes || [];

    let searchQuery = "";
    $: filteredNotes = notes.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let selectedPdf = null;
    const viewPdf = (url) => selectedPdf = url;
    const closePreview = () => selectedPdf = null;
</script>

<div class="note-container">
    <header class="note-header">
        <h1>📚 Koleksi Nota Tatabahasa</h1>
        <p>Klik "Lihat Nota" untuk membaca rujukan secara terus.</p>
    </header>

    <div class="search-bar">
        <input type="text" placeholder="Cari tajuk nota..." bind:value={searchQuery} />
    </div>

    {#if selectedPdf}
        <div class="pdf-viewer-overlay" on:click={closePreview} role="presentation">
            <div class="pdf-content" on:click|stopPropagation role="presentation">
                <div class="pdf-header">
                    <span>📖 Paparan Nota</span>
                    <button class="close-btn" on:click={closePreview}>✖ Tutup</button>
                </div>
                <iframe src="{selectedPdf}#view=FitH" title="PDF Viewer" width="100%" height="600px" style="border: none;"></iframe>
                <div class="pdf-footer">
                    <p>Masalah memaparkan? <a href={selectedPdf} target="_blank" rel="noreferrer">Buka di Tab Baru</a></p>
                </div>
            </div>
        </div>
    {/if}

    <div class="note-grid">
        {#each filteredNotes as note}
            <div class="note-card">
                <div class="image-box">
                    <img
                        src={note.cover_image || '/default-note.png'}
                        alt={note.title}
                        class="cover-img"
                    />
                </div>
                <div class="note-body">
                    <span class="category-tag">{note.category}</span>
                    <h3 class="note-title">{note.title}</h3>
                    <p class="date">Dimuat naik: {note.created_at ? new Date(note.created_at).toLocaleDateString('ms-MY') : 'Tiada Tarikh'}</p>
                    <div class="actions">
                        <button class="view-btn" on:click={() => viewPdf(note.file_url)}>Lihat Nota</button>
                        <a href={note.file_url} download class="download-link">Muat Turun</a>
                    </div>
                </div>
            </div>
        {:else}
            <div class="empty-state">
                <p>Tiada nota dijumpai.</p>
            </div>
        {/each}
    </div>
</div>

<style>
    .note-container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; font-family: sans-serif; }
    .note-header { text-align: center; margin-bottom: 40px; }
    .note-header h1 { font-size: 2.2rem; color: #1e293b; margin-bottom: 10px; }
    .note-header p { color: #64748b; font-size: 1.1rem; }
    .search-bar { margin-bottom: 40px; }
    .search-bar input { width: 100%; padding: 15px 20px; border: 2px solid #e2e8f0; border-radius: 15px; font-size: 1rem; box-sizing: border-box; transition: border-color 0.2s; }
    .search-bar input:focus { outline: none; border-color: #3b82f6; }
    .note-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
    .note-card { background: white; border-radius: 20px; overflow: hidden; border: 1px solid #eef2f6; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; transition: transform 0.3s ease; }
    .note-card:hover { transform: translateY(-8px); }
    .image-box { width: 100%; height: 200px; background: #f1f5f9; overflow: hidden; }
    .cover-img { width: 100%; height: 100%; object-fit: cover; }
    .note-body { padding: 20px; flex-grow: 1; display: flex; flex-direction: column; }
    .category-tag { display: inline-block; width: fit-content; font-size: 0.7rem; font-weight: bold; color: white; background: #3b82f6; padding: 4px 12px; border-radius: 50px; text-transform: uppercase; margin-bottom: 12px; }
    .note-title { font-size: 1.3rem; color: #1e293b; line-height: 1.4; margin: 0 0 8px 0; font-weight: 700; }
    .date { font-size: 0.85rem; color: #94a3b8; margin-bottom: 20px; }
    .actions { margin-top: auto; display: flex; align-items: center; justify-content: space-between; padding-top: 15px; border-top: 1px solid #f1f5f9; }
    .view-btn { background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-weight: bold; cursor: pointer; transition: background 0.2s; }
    .view-btn:hover { background: #2563eb; }
    .download-link { font-size: 0.85rem; color: #64748b; text-decoration: underline; }
    .pdf-viewer-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .pdf-content { background: white; width: 100%; max-width: 900px; border-radius: 15px; overflow: hidden; }
    .pdf-header { background: #1e293b; color: white; padding: 15px 20px; display: flex; justify-content: space-between; }
    .pdf-footer { padding: 15px; text-align: center; background: #f8fafc; font-size: 0.9rem; }
    .close-btn { background: #ef4444; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer; }
    .empty-state { grid-column: 1 / -1; text-align: center; padding: 100px 0; color: #94a3b8; }
</style>