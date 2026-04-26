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
                <label>Emel Pengguna</label>
                <input name="email" type="email" required />
            </div>
            <div class="input-group">
                <label>Kata Laluan</label>
                <input name="password" type="password" required />
            </div>
            <button type="submit" class="btn-primary">Masuk Sekarang</button>
        </form>

        <p class="footer-text">Belum ada akaun? <a href="/register">Daftar di sini</a></p>
    </div>
</div>

<style>
    .auth-wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #3b82f6 0%, #1e293b 100%); }
    .auth-card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px; text-align: center; }
    h1 { color: #1e293b; font-size: 1.8rem; margin-bottom: 5px; }
    .subtitle { color: #64748b; margin-bottom: 30px; font-weight: 500; }
    .error-box { color: #c53030; background: #fed7d7; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-weight: 500; border: 1px solid #feb2b2; }
    .input-group { text-align: left; margin-bottom: 20px; }
    .input-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #334155; }
    .input-group input { width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; font-size: 1rem; }
    .btn-primary { width: 100%; background-color: #3b82f6; color: white; padding: 14px; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; margin-top: 10px; }
    .footer-text { margin-top: 25px; color: #64748b; }
    .footer-text a { color: #3b82f6; font-weight: bold; text-decoration: none; }
</style>