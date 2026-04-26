<script>
    let inputText = '';
    let isChecking = false;
    let result = null;
    let errorMessage = '';

    async function checkGrammar() {
        if (!inputText.trim()) return;

        isChecking = true;
        errorMessage = '';
        result = null;

        try {
            const response = await fetch('/api/checker', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText })
            });

            const data = await response.json();

            if (!response.ok) {
                errorMessage = data.error || "Gagal menghubungi AI.";
            } else {
                result = {
                    original: inputText,
                    corrected: data.corrected, 
                    explanation: "Disemak menggunakan model T5 Bahasa Melayu (Mesolitica - Hugging Face)." // ✅ FIXED
                };
            }
        } catch (err) {
            errorMessage = "Ralat server. Pastikan 'npm run dev' masih aktif.";
        } finally {
            isChecking = false;
        }
    }
</script>

<div class="max-w-4xl mx-auto p-4">
    <header class="mb-8">
        <h1 class="text-3xl font-extrabold text-gray-800">Penyemak Tatabahasa AI</h1>
        <p class="text-gray-500">Sistem FYP: Struktur Ayat, Kata Sendi Nama, dan Ejaan.</p>
    </header>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <textarea 
            bind:value={inputText}
            placeholder="Taip atau tampal ayat Bahasa Melayu di sini..."
            class="w-full h-64 p-6 text-lg outline-none resize-none placeholder-gray-300 focus:ring-2 focus:ring-blue-500 transition-all"
        ></textarea>
        
        <div class="p-4 bg-gray-50 border-t flex justify-between items-center">
            <span class="text-sm text-gray-400">{inputText.length} aksara</span>
            <button 
                onclick={checkGrammar}
                disabled={isChecking}
                class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center space-x-2 disabled:opacity-50">
                {#if isChecking}
                    <span class="animate-spin text-xl">⏳</span>
                    <span>Menyemak...</span>
                {:else}
                    <span>Semak Sekarang</span>
                {/if}
            </button>
        </div>
    </div>

    {#if errorMessage}
        <div class="mt-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
            {errorMessage}
        </div>
    {/if}

    {#if result}
        <div class="mt-8 p-6 bg-white rounded-2xl border-l-8 border-green-500 shadow-lg">
            <h3 class="font-bold text-gray-800 mb-2">Cadangan Penambahbaikan:</h3>
            <p class="text-xl text-green-700 font-semibold mb-4">
                {result.corrected}
            </p>
            <hr class="mb-4" />
            <p class="text-gray-600 leading-relaxed">
                <span class="font-bold text-blue-800">Analisis AI:</span> {result.explanation}
            </p>
        </div>
    {/if}
</div>
