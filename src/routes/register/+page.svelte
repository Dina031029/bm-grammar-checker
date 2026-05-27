<script>
    import { enhance } from '$app/forms';
    export let form;
</script>

<div class="auth-container">
    <div class="auth-card">
        <h1>Daftar Akaun 📝</h1>
        <p>Sertai kami untuk mula belajar Tatabahasa</p>

        {#if form?.message}
            <div class="status-box" class:error-style={form.error}>
                {form.message}
            </div>
        {/if}

        <form method="POST" use:enhance>
            <div class="input-group">
                <label for="fullname">Nama Penuh</label>
                <input type="text" id="fullname" name="fullname" placeholder="Nama penuh anda" required />
            </div>
            <div class="input-group">
                <label for="email">E-mel</label>
                <input type="email" id="email" name="email" placeholder="nama@emel.com" required />
            </div>
            <div class="input-group">
                <label for="password">Kata Laluan</label>
                <input type="password" id="password" name="password" placeholder="Minimal 6 aksara" required />
            </div>
            <div class="input-group">
                <label for="confirm">Sahkan Kata Laluan</label>
                <input type="password" id="confirm" name="confirm" placeholder="Ulang kata laluan" required />
            </div>
            <button type="submit" class="auth-btn">Daftar Sekarang</button>
        </form>

        <p class="login-link">Dah ada akaun? <a href="/login">Log masuk</a></p>
    </div>
</div>

<style>
    .auth-container { 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        min-height: 100vh; 
        /* Menggunakan webcover.png daripada folder static */
        background: url('/webcover.png') no-repeat center center/cover; 
        padding: 20px; 
        position: relative;
    }
    /* Menambah tindihan lapisan gelap (overlay) lembut */
    .auth-container::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(15, 23, 42, 0.4);
        z-index: 1;
    }
    .auth-card { 
        background: rgba(255, 255, 255, 0.95); 
        backdrop-filter: blur(8px);
        padding: 30px; 
        border-radius: 15px; 
        box-shadow: 0 10px 25px rgba(0,0,0,0.3); 
        width: 100%; 
        max-width: 450px; 
        text-align: center; 
        z-index: 2;
    }
    h1 { color: #2d3748; margin-bottom: 5px; }
    p { color: #718096; margin-bottom: 25px; }
    .input-group { text-align: left; margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: 600; color: #4a5568; }
    input { width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; background: white; }
    .auth-btn { width: 100%; padding: 12px; background: #48bb78; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; margin-top: 10px; }
    .auth-btn:hover { background: #38a169; }
    .status-box { background: #ebf8ff; color: #2b6cb0; padding: 10px; border-radius: 5px; margin-bottom: 15px; }
    .error-style { background: #fed7d7; color: #c53030; }
    .login-link { margin-top: 20px; font-size: 0.9rem; color: #718096; }
    .login-link a { color: #667eea; text-decoration: none; font-weight: bold; }
</style>