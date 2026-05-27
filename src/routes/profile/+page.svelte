<script>
    import { enhance } from '$app/forms';
    import { invalidate } from '$app/navigation'; // ONLY this import for invalidation
    export let data;
    export let form;

    $: user = data?.user;

    // Reactive declaration for the image URL
    let previewUrl;
    $: if (user) {
        previewUrl = (user.profile_image === 'default-avatar.png' || !user.profile_image)
            ? '/default-avatar.png' 
            : (user.profile_image.startsWith('http') 
                ? user.profile_image 
                : `/uploads/profile/${user.profile_image}?t=${Date.now()}`);
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
            previewUrl = URL.createObjectURL(file);
        }
    }
</script>

<form 
    method="POST" 
    action="?/updateProfile" 
    enctype="multipart/form-data"
    use:enhance={() => {
        return async ({ result }) => {
            if (result.type === 'success') {
                // This triggers the 'app:user' dependency in your layout
                await invalidate('app:user'); 
            }
        };
    }}
>
    </form>

{#if user}
<div class="profile-wrapper">
    <div class="profile-container">
        <h1>👤 Profil Saya</h1>
        
        {#if form?.success}
            <div class="msg-success">✅ {form.message}</div>
        {/if}

        <form 
            method="POST" 
            action="?/updateProfile" 
            enctype="multipart/form-data"
            use:enhance={() => {
                return async ({ result }) => {
                    if (result.type === 'success') {
                        // Refresh the 'app:user' data so the sidebar updates
                        await invalidate('app:user'); 
                    }
                };
            }}
        >
            
            <div class="image-section">
                <div class="img-relative">
                    <img src={previewUrl} alt="Avatar" class="profile-big-img" />
                    <div class="floating-badge" title={user.badgeName} style="border: 2px solid {user.badgeColor}">
                        {user.badgeIcon}
                    </div>
                </div>
                
                <div class="image-buttons">
                    <label class="upload-label">
                        📸 Tukar Gambar
                        <input type="file" name="profile_pic" accept="image/*" on:change={handleFileChange} hidden />
                    </label>
                    
                    {#if user.profile_image !== 'default-avatar.png'}
                        <button type="submit" formaction="?/deleteImage" class="delete-img-btn">🗑️ Buang</button>
                    {/if}
                </div>
            </div>

            <input type="hidden" name="current_image" value={user.profile_image} />

            <div class="stats-grid">
                <div class="stat-box mata">
                    <span class="label">Mata Terkumpul</span>
                    <span class="value">✨ {user.points}</span>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: {Math.min((user.points / 1000) * 100, 100)}%"></div>
                    </div>
                </div>
                
                <div class="stat-box lencana" style="border-color: {user.badgeColor}">
                    <span class="label">Pangkat</span>
                    <span class="value" style="color: {user.badgeColor}">
                         {user.badgeName}
                    </span>
                    <span class="badge-icon-large">{user.badgeIcon}</span>
                </div>
            </div>

            <hr class="divider" />

            <div class="input-group">
                <label for="fullname">Nama Penuh</label>
                <input type="text" id="fullname" name="fullname" value={user.fullname} required />
            </div>

            <div class="input-group">
                <label for="email">Alamat Emel</label>
                <input type="email" id="email" name="email" value={user.email} required />
            </div>

            <div class="input-group">
                <label for="password">Kata Laluan</label>
                <input type="password" id="password" name="password" value={user.password} required />
            </div>

            <button type="submit" class="save-btn">💾 Simpan Perubahan</button>
        </form>
    </div>
</div>
{:else}
    <div class="loading">Memuatkan profil...</div>
{/if}

<style>
    .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; color: #64748b; }
    .profile-wrapper { display: flex; justify-content: center; padding: 40px 20px; background: #f1f5f9; min-height: 100vh; }
    .profile-container { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); width: 100%; max-width: 550px; text-align: center; }
    h1 { color: #1e293b; margin-bottom: 30px; font-size: 1.8rem; }
    .image-section { margin-bottom: 30px; display: flex; flex-direction: column; align-items: center; }
    .img-relative { position: relative; width: 150px; height: 150px; }
    .profile-big-img { width: 150px; height: 150px; border-radius: 50%; object-fit: cover; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .floating-badge { position: absolute; bottom: 5px; right: 5px; background: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
    .image-buttons { display: flex; gap: 10px; margin-top: 15px; }
    .upload-label { background: #3b82f6; color: white; padding: 10px 18px; border-radius: 12px; cursor: pointer; font-size: 0.85rem; font-weight: 600; }
    .delete-img-btn { background: #fee2e2; color: #ef4444; border: none; padding: 10px 18px; border-radius: 12px; cursor: pointer; font-size: 0.85rem; font-weight: 600; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
    .stat-box { background: #ffffff; padding: 15px; border-radius: 16px; border: 2px solid #f1f5f9; text-align: left; }
    .stat-box .label { font-size: 0.75rem; color: #64748b; font-weight: 600; }
    .stat-box .value { font-size: 1.2rem; font-weight: 800; }
    .progress-bar-bg { background: #e2e8f0; height: 6px; border-radius: 10px; margin-top: 8px; overflow: hidden; }
    .progress-bar-fill { background: #f59e0b; height: 100%; border-radius: 10px; }
    .badge-icon-large { font-size: 1.5rem; margin-top: 5px; }
    .divider { border: 0; border-top: 1px solid #f1f5f9; margin: 25px 0; }
    .input-group { text-align: left; margin-bottom: 18px; }
    .input-group label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 6px; color: #475569; }
    .input-group input { width: 100%; padding: 12px 16px; border: 2px solid #f1f5f9; border-radius: 12px; box-sizing: border-box; }
    .save-btn { width: 100%; background: #10b981; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; }
    .msg-success { color: #065f46; background: #d1fae5; padding: 12px; border-radius: 12px; margin-bottom: 25px; }
</style>