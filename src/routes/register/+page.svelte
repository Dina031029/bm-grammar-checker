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
                <label>Nama Penuh</label>
                <input type="text" name="fullname" placeholder="Nama anda" required />
            </div>
            <div class="input-group">
                <label>E-mel</label>
                <input type="email" name="email" placeholder="nama@emel.com" required />
            </div>
            <div class="input-group">
                <label>Kata Laluan</label>
                <input type="password" name="password" placeholder="Minimal 6 aksara" required />
            </div>
            <div class="input-group">
                <label>Sahkan Kata Laluan</label>
                <input type="password" name="confirm" placeholder="Ulang kata laluan" required />
            </div>
            <button type="submit" class="auth-btn">Daftar Sekarang</button>
        </form>

        <p class="login-link">Dah ada akaun? <a href="/login">Log masuk</a></p>
    </div>
</div>

<style>
    .auth-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
    .auth-card { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); width: 100%; max-width: 450px; text-align: center; }
    h1 { color: #2d3748; margin-bottom: 5px; }
    p { color: #718096; margin-bottom: 25px; }
    .input-group { text-align: left; margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: 600; color: #4a5568; }
    input { width: 100%; padding: 10px; border: 2px solid #e2e8f0; border-radius: 8px; box-sizing: border-box; }
    .auth-btn { width: 100%; padding: 12px; background: #48bb78; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; margin-top: 10px; }
    .status-box { background: #ebf8ff; color: #2b6cb0; padding: 10px; border-radius: 5px; margin-bottom: 15px; }
    .error-style { background: #fed7d7; color: #c53030; }
    .login-link { margin-top: 20px; font-size: 0.9rem; }
    .login-link a { color: #667eea; text-decoration: none; font-weight: bold; }
</style>