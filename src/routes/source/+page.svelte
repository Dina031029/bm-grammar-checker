<script>
	const sources = [
		{
			title: 'Hugging Face',
			type: 'AI Model Platform',
			description:
				'Digunakan sebagai platform untuk mengakses dan menguji model kecerdasan buatan bagi fungsi penyemakan tatabahasa Bahasa Melayu.',
			link: 'https://huggingface.co/RichardErkhov/mesolitica_-_malaysian-llama-3-8b-instruct-16k-gguf'
		},
		{
			title: 'Dewan Bahasa dan Pustaka',
			type: 'Rujukan Bahasa Melayu',
			description:
				'Dirujuk sebagai panduan umum penggunaan Bahasa Melayu standard, tatabahasa dan gaya bahasa yang betul.',
			link: 'https://prpm.dbp.gov.my/'
		},
		{
			title: 'SvelteKit',
			type: 'Web Framework',
			description:
				'Digunakan sebagai framework utama dalam pembangunan sistem web ini, termasuk routing, halaman web dan backend API.',
			link: 'https://svelte.dev/docs/kit'
		},
		{
			title: 'MySQL / TiDB',
			type: 'Database',
			description:
				'Digunakan untuk menyimpan data pengguna, kuiz, nota, markah dan maklumat berkaitan sistem pembelajaran.',
			link: 'https://www.mysql.com/'
		},
		
		{
			title: 'Nota Tatabahasa',
			type: 'Rujukan',
			description:
				'Rujukan nota tatabahasa Bahasa Melayu yang digunakan sebagai panduan dalam penyediaan kandungan dan nota pembelajaran sistem.',
			link: 'https://panitiabmskseripasir.blogspot.com/2010/01/nota-tatabahasa-untuk-pelajar.html'
		},
		{
			title: 'Cikgu Sazali',
			type: 'Rujukan',
			description:
				'Blog pendidikan yang menyediakan bahan rujukan, nota dan penerangan tatabahasa Bahasa Melayu untuk membantu pembangunan nota pembelajaran sistem.',
			link: 'https://cikgusazali.blogspot.com/'
		}
	];
</script>

<svelte:head>
	<title>Sumber Rujukan | Sistem Tatabahasa Bahasa Melayu</title>
</svelte:head>

<section class="source-page">
	<div class="hero-card">
		<p class="eyebrow">Penghargaan & Rujukan</p>
		<h1>Sumber yang Digunakan</h1>
		<p class="intro">
			Halaman ini disediakan sebagai penghargaan kepada pemilik sumber, platform,
			teknologi dan rujukan yang digunakan dalam pembangunan sistem ini.
		</p>
	</div>

	<div class="content-grid">
		<div class="main-card">
			<h2>Senarai Sumber</h2>
			<p class="section-desc">
				Sumber berikut digunakan untuk menyokong pembangunan sistem penyemak
				tatabahasa dan pembelajaran Bahasa Melayu ini.
			</p>

			<div class="source-list">
				{#each sources as source}
					<article class="source-item">
						<div class="source-header">
							<div>
								<h3>{source.title}</h3>
								<span>{source.type}</span>
							</div>
						</div>

						<p>{source.description}</p>

						<a href={source.link} target="_blank" rel="noopener noreferrer">
							Lihat Sumber
						</a>
					</article>
				{/each}
			</div>
		</div>

		<aside class="note-card">
			<h2>Informasi</h2>
			<p>
				Sistem ini dibangunkan untuk tujuan akademik sebagai sebahagian daripada
				Final Year Project. Semua sumber dirujuk dengan niat menghargai hasil kerja
				pemilik asal dan menyokong pembelajaran Bahasa Melayu secara digital.
			</p>
			<div class="credit-box">
				<p class="label">Dibimbing oleh</p>
				<strong>Prof Madya Ts Dr Sarah Flora Anak Samson Juan</strong>
				<span>Pensyarah, Fakulti Sains Komputer dan Teknologi Maklumat,UNIMAS</span>
			</div>
			<div class="credit-box">
				<p class="label">Dibangunkan oleh</p>
				<strong>NURDINA BINTI ZAMRI</strong>
				<span>AI-Powered Bahasa Melayu Grammar Learning and Checker Web System</span>
			</div>
		</aside>
	</div>
</section>

<style>
	.source-page {
		max-width: 1150px;
		margin: 0 auto;
	}

	.hero-card {
		background: linear-gradient(135deg, #ffffff, #eff6ff);
		border: 1px solid #dbeafe;
		border-radius: 24px;
		padding: 36px;
		margin-bottom: 28px;
		box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
	}

	.eyebrow {
		margin: 0 0 10px;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		color: #2563eb;
	}

	h1 {
		margin: 0;
		font-size: 2rem;
		color: #0f172a;
	}

	.intro {
		margin: 14px 0 0;
		max-width: 760px;
		color: #475569;
		line-height: 1.7;
		font-size: 1rem;
	}

	.content-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 330px;
		gap: 24px;
		align-items: start;
	}

	.main-card,
	.note-card {
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 22px;
		padding: 28px;
		box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
	}

	h2 {
		margin: 0 0 8px;
		color: #0f172a;
		font-size: 1.25rem;
	}

	.section-desc {
		margin: 0 0 22px;
		color: #64748b;
		line-height: 1.6;
	}

	.source-list {
		display: grid;
		gap: 16px;
	}

	.source-item {
		border: 1px solid #e2e8f0;
		border-radius: 18px;
		padding: 20px;
		background: #f8fafc;
		transition: 0.2s ease;
	}

	.source-item:hover {
		transform: translateY(-3px);
		border-color: #bfdbfe;
		box-shadow: 0 10px 20px rgba(37, 99, 235, 0.08);
	}

	.source-header {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 10px;
	}

	.source-item h3 {
		margin: 0 0 5px;
		color: #1e293b;
		font-size: 1.05rem;
	}

	.source-item span {
		display: inline-block;
		font-size: 0.76rem;
		font-weight: 700;
		color: #2563eb;
		background: #dbeafe;
		padding: 5px 10px;
		border-radius: 999px;
	}

	.source-item p {
		margin: 12px 0;
		color: #475569;
		line-height: 1.6;
	}

	.source-item a {
		display: inline-block;
		margin-top: 4px;
		color: #2563eb;
		font-weight: 700;
		text-decoration: none;
	}

	.source-item a:hover {
		text-decoration: underline;
	}

	.note-card {
		position: sticky;
		top: 20px;
	}

	.note-card p {
		color: #475569;
		line-height: 1.7;
		margin-bottom: 22px;
	}

	.credit-box {
		background: #f1f5f9;
		border: 1px solid #e2e8f0;
		border-radius: 18px;
		padding: 18px;
	}

	.credit-box .label {
		margin: 0 0 6px;
		color: #64748b;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.credit-box strong {
		display: block;
		color: #0f172a;
		margin-bottom: 8px;
		font-size: 1rem;
	}

	.credit-box span {
		display: block;
		color: #64748b;
		font-size: 0.88rem;
		line-height: 1.5;
	}

	@media (max-width: 900px) {
		.content-grid {
			grid-template-columns: 1fr;
		}

		.note-card {
			position: static;
		}
	}

	@media (max-width: 600px) {
		.hero-card,
		.main-card,
		.note-card {
			padding: 22px;
			border-radius: 18px;
		}

		h1 {
			font-size: 1.6rem;
		}
	}
</style>