<script>
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
    export let data;

    $: user = data?.user || { 
        fullname: "Tetamu", 
        points: 0, 
        badge: "Sila Log Masuk", 
        profile_image: 'default-avatar.png',
        role: 'user' 
    };

    $: isAuthPage = $page.url.pathname.startsWith('/login') || $page.url.pathname.startsWith('/register');

    let timestamp = Date.now();
    $: profileImgPath = user.profile_image === 'default-avatar.png' 
        ? '/default-avatar.png' 
        : `/uploads/profile/${user.profile_image}?t=${timestamp}`;

    $: if (user.profile_image) {
        timestamp = Date.now();
    }
</script>

{#if isAuthPage}
    <slot />
{:else}
    <div class="app-layout">
        <aside class="sidebar">
            <div class="profile-card">
                <div class="avatar-container">
                    {#if user.profile_image === 'default-avatar.png'}
                        <div class="avatar-placeholder">👤</div>
                    {:else}
                        <img src={profileImgPath} alt="Avatar" class="sidebar-img" />
                    {/if}
                </div>
                <h3>{user.fullname}</h3>
                <div class="stats">
                    <span class="points">✨ {user.points} Mata</span>
                    <span class="badge">
                        {user.role === 'admin' ? '🛡️ Admin' : `🏅 ${user.badge}`}
                    </span>
                </div>
            </div>

            <nav class="nav-menu">
                <p class="menu-label">MENU UTAMA</p>
                <a href="/" class={$page.url.pathname === '/' ? 'active' : ''}>📝 Penyemak Tatabahasa</a>
                <a href="/quiz" class={$page.url.pathname === '/quiz' ? 'active' : ''}>🎮 Kuiz Interaktif</a>
                <a href="/note" class={$page.url.pathname === '/note' ? 'active' : ''}>📚 Koleksi Nota</a>
                <a href="/profile" class={$page.url.pathname === '/profile' ? 'active' : ''}>👤 Profil Saya</a>

                {#if user.role === 'admin'}
                    <div class="admin-section">
                        <p class="menu-label admin-text">PENTADBIRAN</p>
                        <a href="/admin/dashboard" class={$page.url.pathname.startsWith('/admin/dashboard') ? 'active admin-active' : ''}>📊 Laporan Kemajuan Pelajar</a>
                        <a href="/admin/quiz" class={$page.url.pathname.startsWith('/admin/quiz') ? 'active admin-active' : ''}>⚙️ Urus Kuiz</a>
                        <a href="/admin/note" class={$page.url.pathname.startsWith('/admin/note') ? 'active admin-active' : ''}>📁 Urus Nota</a>
                    </div>
                {/if}
            </nav>

            <form method="POST" action="/logout" use:enhance>
                <button type="submit" class="logout-btn">🚪 Log Keluar</button>
            </form>
        </aside>

        <div class="main-content">
            <header class="topbar">
                <h2>Sistem Pembelajaran Tatabahasa Bahasa Melayu</h2>
                <div class="top-user-info">
                    <span class="top-name">{user.fullname}</span>
                    <a href="/profile" class="top-avatar-link">
                        <img src={profileImgPath} alt="nav-avatar" class="top-nav-img" />
                    </a>
                </div>
            </header>
            
            <main class="page-container">
                <slot />
            </main>
        </div>
    </div>
{/if}

<style>
    :global(body) { 
        margin: 0; 
        font-family: 'Segoe UI', Roboto, sans-serif; 
        background: #f3f4f6; 
        color: #1e293b; 
    }
    
    /* FLEX LAYOUT FOR SIDEBAR */
    .app-layout { 
        display: flex; 
        height: 100vh; 
        overflow: hidden; 
    }

    .sidebar { 
        width: 280px; 
        background: #1e293b; 
        color: white; 
        padding: 25px 20px; 
        display: flex; 
        flex-direction: column; 
        box-shadow: 4px 0 10px rgba(0,0,0,0.1); 
    }
    
    .profile-card { 
        background: #334155; 
        padding: 20px; 
        border-radius: 16px; 
        text-align: center; 
        margin-bottom: 30px; 
        border: 1px solid #475569; 
    }

    .avatar-container { margin-bottom: 12px; display: flex; justify-content: center; }
    .avatar-placeholder { font-size: 50px; background: #1e293b; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .sidebar-img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #3b82f6; }
    .profile-card h3 { margin: 10px 0; font-size: 1.1rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .points { color: #fbbf24; font-weight: bold; display: block; font-size: 0.9rem; margin-bottom: 5px; }
    .badge { background: #1e293b; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; display: inline-block; color: #cbd5e1; border: 1px solid #3b82f6; }

    .nav-menu { 
        display: flex; 
        flex-direction: column; 
        gap: 5px; 
        flex-grow: 1; 
        overflow-y: auto; 
    }

    .nav-menu a { 
        color: #94a3b8; 
        text-decoration: none; 
        padding: 12px 15px; 
        border-radius: 10px; 
        transition: 0.3s; 
        font-weight: 500; 
        font-size: 0.95rem; 
        display: block;
    }

    .nav-menu a:hover { color: white; background: rgba(255,255,255,0.05); }
    .nav-menu a.active { background: #3b82f6; color: white; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }

    .admin-section { 
        margin-top: 20px; 
        border-top: 1px solid #334155; 
        padding-top: 15px; 
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .admin-active { background: #ef4444 !important; color: white !important; }

    .logout-btn { width: 100%; background: transparent; color: #ef4444; border: 1px solid #ef4444; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: bold; transition: 0.2s; margin-top: 20px; }
    .logout-btn:hover { background: #ef4444; color: white; }

    .main-content { flex-grow: 1; display: flex; flex-direction: column; min-width: 0; }
    .topbar { background: white; padding: 15px 35px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; }
    .topbar h2 { margin: 0; color: #0f172a; font-size: 1.2rem; font-weight: 700; }
    .top-user-info { display: flex; align-items: center; gap: 15px; }
    .top-name { font-weight: 600; color: #475569; font-size: 0.9rem; }
    .top-nav-img { width: 35px; height: 35px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; }
    
    .page-container { padding: 30px; overflow-y: auto; flex-grow: 1; background: #f8fafc; }
    .page-container::-webkit-scrollbar { display: none; }

    .menu-label { font-size: 0.7rem; font-weight: 700; color: #64748b; margin: 15px 15px 5px; letter-spacing: 1px; }
    .admin-text { color: #f87171; }
    .admin-tag { font-size: 0.6rem; background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; margin-left: 5px; }
</style>