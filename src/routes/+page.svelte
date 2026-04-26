<script>
    let inputText = "";
    let correctedText = "";
    let explanation = "";
    let isChecking = false; 
    const limit = 150;

    $: wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    $: isOverLimit = wordCount > limit;

    // 1. Function to clear the input 
    function clearText() {
        inputText = "";
        correctedText = "";
        explanation = "";
    }

    // 2. Function to copy theresult 
    async function copyToClipboard() {
        if (!correctedText) return;
        try {
            await navigator.clipboard.writeText(correctedText);
            alert("Teks telah disalin!");
        } catch (err) {
            console.error("Gagal menyalin:", err);
        }
    }

    async function handleCheck() {
        if (isOverLimit) {
            alert("Amaran: Teks anda melebihi 150 patah perkataan!");
            return;
        }
        if (wordCount === 0) {
            alert("Sila masukkan teks terlebih dahulu.");
            return;
        }

        // Start loading
        isChecking = true;
        correctedText = ""; 
        explanation = "";

        try {
            // This calls the +server.js file in your routes folder
            const response = await fetch('/api/check', {
                method: 'POST',
                body: JSON.stringify({ text: inputText }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCESS: Set the AI results to your variables
                correctedText = data.corrected;
                explanation = data.explanation;
            } else {
                // ERROR: Show the error message from the AI or server
                alert(data.error || "Ralat berlaku semasa menyemak.");
            }
        } catch (error) {
            alert("Gagal menghubungi pelayan. Sila pastikan 'npm run dev' sedang berjalan.");
        } finally {
            // Stop loading
            isChecking = false;
        }
    }
</script>

<div class="checker-wrapper">
    <div class="header-section">
        <h1>Penyemak Tatabahasa Bahasa Melayu 🤖</h1>
        <p>Sila masukkan teks Bahasa Melayu anda di bawah (Maksimum 150 patah perkataan).</p>
    </div>

 <div class="grid-container">
    <div class="box-card">
        <div class="box-header">
            <div style="display: flex; align-items: center; gap: 10px;">
                <label for="input-tatabahasa">Teks Asal</label>
                {#if inputText}
                    <button class="action-btn delete-btn" on:click={clearText} title="Padam teks">
                        🗑️ Padam
                    </button>
                {/if}
            </div>
            <span class="counter" class:text-red={isOverLimit}>
                {wordCount} / {limit} perkataan
            </span>
        </div>
        <textarea
            id="input-tatabahasa"
            bind:value={inputText}
            placeholder="Taip atau tampal teks anda..."
            class:border-red={isOverLimit}
            disabled={isChecking}
        ></textarea>
        <button class="check-btn" on:click={handleCheck} disabled={isOverLimit || isChecking}>
            {isChecking ? 'Sedang Menyemak...' : 'Semak Teks'}
        </button>
    </div>

    <div class="box-card">
        <div class="box-header">
            <span class="label-style">Hasil Semakan AI</span>
            {#if correctedText}
                <button class="action-btn copy-btn" on:click={copyToClipboard} title="Salin teks">
                    📋 Salin
                </button>
            {/if}
        </div>
        <div class="result-area">
            {#if isChecking}
                <span class="placeholder">AI sedang memproses...</span>
            {:else if correctedText}
                {correctedText}
            {:else}
                <span class="placeholder">Hasil teks yang dibetulkan akan muncul di sini...</span>
            {/if}
        </div>
    </div>
</div>

    <div class="reason-card">
        <h3>💡 INFO</h3>
        <p>
            {#if isChecking}
                Menganalisis kesalahan...
            {:else if explanation}
                {explanation}
            {:else}
                Sistem akan menyenaraikan kesalahan struktur ayat, kata sendi nama, dan ejaan di sini selepas anda menekan butang 'Semak Teks'.
            {/if}
        </p>
    </div>
</div>

<style>
    .checker-wrapper { max-width: 1100px; margin: 0 auto; }
    
    .header-section { text-align: center; margin-bottom: 30px; }
    .header-section h1 { color: #1e293b; margin-bottom: 10px; font-size: 2.2rem; }
    .header-section p { color: #64748b; font-size: 1.1rem; }

    .grid-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 25px;
        margin-bottom: 25px;
    }

    .box-card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        display: flex;
        flex-direction: column;
    }

    .box-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .box-header label { font-weight: bold; color: #334155; }
    .counter { font-size: 0.9rem; color: #64748b; }
    .text-red { color: #ef4444; font-weight: bold; }
    .border-red { border-color: #ef4444 !important; }

    textarea, .result-area {
        width: 100%;
        height: 250px;
        padding: 15px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 1rem;
        font-family: inherit;
        resize: none;
        box-sizing: border-box; /* Crucial for sizing */
    }

    .result-area { background-color: #f8fafc; overflow-y: auto; }
    .placeholder { color: #94a3b8; font-style: italic; }

    .check-btn {
        margin-top: 15px;
        background-color: #3b82f6;
        color: white;
        border: none;
        padding: 12px;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: 0.2s;
    }
    .check-btn:hover:not(:disabled) { background-color: #2563eb; }
    .check-btn:disabled { background-color: #cbd5e1; cursor: not-allowed; }

    .reason-card {
        background: white;
        padding: 25px;
        border-radius: 12px;
        border-left: 6px solid #fbbf24;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .reason-card h3 { margin-top: 0; color: #b45309; }
    .reason-card p { color: #334155; line-height: 1.6; margin-bottom: 0; }

    .action-btn {
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: 0.2s;
        color: #475569;
    }

    .delete-btn:hover {
        background: #fef2f2;
        color: #ef4444;
        border-color: #fee2e2;
    }

    .copy-btn:hover {
        background: #f0f9ff;
        color: #3b82f6;
        border-color: #e0f2fe;
    }
</style>