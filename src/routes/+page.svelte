<script>
    let inputText = "";
    let correctedText = "";
    let explanation = "";
    let errorMessage = "";
    let isChecking = false;

    const limit = 20;

    $: wordCount = inputText.trim()
        ? inputText.trim().split(/\s+/).length
        : 0;

    $: isOverLimit = wordCount > limit;

    function clearText() {
        inputText = "";
        correctedText = "";
        explanation = "";
        errorMessage = "";
    }

    async function copyToClipboard() {
        if (!correctedText) return;

        try {
            await navigator.clipboard.writeText(correctedText);
            alert("Teks telah disalin!");
        } catch (err) {
            console.error("Gagal menyalin:", err);
            alert("Gagal menyalin teks.");
        }
    }

    async function handleCheck() {
        errorMessage = "";
        correctedText = "";
        explanation = "";

        if (isOverLimit) {
            errorMessage = `Teks anda melebihi ${limit} patah perkataan.`;
            return;
        }

        if (wordCount === 0) {
            errorMessage = "Sila masukkan teks terlebih dahulu.";
            return;
        }

        isChecking = true;

        try {
            const response = await fetch("/api/check", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: inputText.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                errorMessage = data.error || "Ralat berlaku semasa menyemak teks.";
                return;
            }

            correctedText = data.corrected || "";
            explanation = data.explanation || "";
        } catch (error) {
            console.error(error);
            errorMessage = "Gagal menghubungi pelayan. Pastikan npm run dev dan ollama serve sedang berjalan.";
        } finally {
            isChecking = false;
        }
    }
</script>

<div class="checker-wrapper">
    <div class="header-section">
        <h1>Penyemak Tatabahasa Bahasa Melayu 🤖</h1>
        <p>Sila masukkan teks Bahasa Melayu anda di bawah. Maksimum {limit} patah perkataan.</p>
    </div>

    {#if errorMessage}
        <div class="error-card">
            {errorMessage}
        </div>
    {/if}

    <div class="grid-container">
        <div class="box-card">
            <div class="box-header">
                <div class="label-row">
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
                placeholder="Contoh: sya makn nasi goreng di kuala lumpur pada hari hari"
                class:border-red={isOverLimit}
                disabled={isChecking}
            ></textarea>

            <button
                class="check-btn"
                on:click={handleCheck}
                disabled={isOverLimit || isChecking}
            >
                {isChecking ? "Sedang Menyemak..." : "Semak Teks"}
            </button>
        </div>

        <div class="box-card">
            <div class="box-header">
                <span class="label-style">Hasil Semakan</span>

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
                Sistem akan membetulkan ejaan, kata sendi nama, struktur ayat dan huruf besar.
            {/if}
        </p>
    </div>
</div>

<style>
    .checker-wrapper {
        max-width: 1100px;
        margin: 0 auto;
    }

    .header-section {
        text-align: center;
        margin-bottom: 30px;
    }

    .header-section h1 {
        color: #1e293b;
        margin-bottom: 10px;
        font-size: 2.2rem;
    }

    .header-section p {
        color: #64748b;
        font-size: 1.1rem;
    }

    .error-card {
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #fecaca;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 20px;
        font-weight: 600;
    }

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
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        display: flex;
        flex-direction: column;
    }

    .box-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        gap: 10px;
    }

    .label-row {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .box-header label,
    .label-style {
        font-weight: bold;
        color: #334155;
    }

    .counter {
        font-size: 0.9rem;
        color: #64748b;
    }

    .text-red {
        color: #ef4444;
        font-weight: bold;
    }

    .border-red {
        border-color: #ef4444 !important;
    }

    textarea,
    .result-area {
        width: 100%;
        height: 250px;
        padding: 15px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        font-size: 1rem;
        font-family: inherit;
        resize: none;
        box-sizing: border-box;
    }

    .result-area {
        background-color: #f8fafc;
        overflow-y: auto;
        white-space: pre-wrap;
    }

    .placeholder {
        color: #94a3b8;
        font-style: italic;
    }

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

    .check-btn:hover:not(:disabled) {
        background-color: #2563eb;
    }

    .check-btn:disabled {
        background-color: #cbd5e1;
        cursor: not-allowed;
    }

    .reason-card {
        background: white;
        padding: 25px;
        border-radius: 12px;
        border-left: 6px solid #fbbf24;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .reason-card h3 {
        margin-top: 0;
        color: #b45309;
    }

    .reason-card p {
        color: #334155;
        line-height: 1.6;
        margin-bottom: 0;
    }

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

    @media (max-width: 768px) {
        .grid-container {
            grid-template-columns: 1fr;
        }

        .header-section h1 {
            font-size: 1.7rem;
        }
    }
</style>