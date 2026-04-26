<script>
    export let data;
</script>

<div class="admin-container">
    <h1>📊 Laporan Kemajuan Pelajar</h1>
    <p>Pantau prestasi pelajar dan pengagihan mata.</p>

    <div class="table-card">
        <table>
            <thead>
                <tr>
                    <th>Nama Pelajar</th>
                    <th>Alamat Emel</th>
                    <th>Mata ✨</th>
                    <th>Pangkat 🏅</th>
                </tr>
            </thead>
            <tbody>
                {#each data.students as student}
                    <tr>
                        <td class="user-cell">
                            <img src={student.profile_image === 'default-avatar.png' ? '/default-avatar.png' : `/uploads/profile/${student.profile_image}`} alt="avatar" />
                            {student.fullname}
                        </td>
                        <td>{student.email}</td>
                        <td class="points-text">{student.points}</td>
                        <td><span class="badge-tag">{student.badge}</span></td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .admin-container { padding: 30px; }
    .table-card { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 15px; text-align: left; border-bottom: 1px solid #f1f5f9; }
    .user-cell { display: flex; align-items: center; gap: 12px; }
    .user-cell img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
    .points-text { font-weight: bold; color: #2563eb; }
    .badge-tag { background: #eff6ff; color: #1e40af; padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
</style>