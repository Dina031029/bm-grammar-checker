<script>
    import { enhance } from '$app/forms';
    export let form;
</script>

<div class="auth-wrapper">
    <div class="auth-card">
        <h1>Log Masuk</h1>
        <p class="subtitle">Sila masuk ke akaun anda</p>
       
        {#if form?.message}
            <div class="error-box">
                {form.message}
            </div>
        {/if}

        <form method="POST" use:enhance>
            <div class="input-group">
                <label for="email">Emel Pengguna</label>
                <input id="email" name="email" type="email" autocomplete="email" required />
            </div>
            <div class="input-group">
                <label for="password">Kata Laluan</label>
                <input id="password" name="password" type="password" required />
            </div>
            <button type="submit" class="btn-primary">Masuk Sekarang</button>
        </form>

        <p class="footer-text">Belum ada akaun? <a href="/register">Daftar di sini</a></p>
    </div>
</div>

<style>
    .auth-wrapper { 
        min-height: 100vh; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        /* Menggunakan webcover.png daripada folder static */
        background: url('/webcover.png') no-repeat center center/cover; 
        padding: 20px;
        position: relative;
    }
    /* Menambah tindihan lapisan gelap (overlay) lembut supaya kad borang kelihatan jelas */
    .auth-wrapper::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(15, 23, 42, 0.4);
        z-index: 1;
    }
    .auth-card { 
        background: rgba(255, 255, 255, 0.95); 
        backdrop-filter: blur(8px);
        padding: 40px; 
        border-radius: 16px; 
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); 
        width: 100%; 
        max-width: 400px; 
        text-align: center; 
        z-index: 2;
    }
    h1 { color: #1e293b; font-size: 1.8rem; margin-bottom: 5px; }
    .subtitle { color: #64748b; margin-bottom: 30px; font-weight: 500; }
    .error-box { color: #c53030; background: #fed7d7; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-weight: 500; border: 1px solid #feb2b2; }
    .input-group { text-align: left; margin-bottom: 20px; }
    .input-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #334155; }
    .input-group input { width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; font-size: 1rem; background: white; }
    .btn-primary { width: 100%; background-color: #3b82f6; color: white; padding: 14px; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; margin-top: 10px; }
    .btn-primary:hover { background-color: #2563eb; }
    .footer-text { margin-top: 25px; color: #64748b; }
    .footer-text a { color: #3b82f6; font-weight: bold; text-decoration: none; }
</style>