// Cấu hình web. Astro = bộ dựng web tĩnh; Starlight = khuôn web tài liệu (thanh bên, tìm kiếm, nền tối).
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkNhan from './src/plugins/remark-nhan.mjs';
import { KHU, THU_TU_KHU } from './src/data/khu.mjs';

const BASE = '/nhu-tuong';

export default defineConfig({
	site: 'https://vinh210a1-ship-it.github.io',
	base: BASE,
	trailingSlash: 'always',
	markdown: {
		processor: unified({
			// remarkMath đọc công thức $...$; remarkNhan đổi nhãn [N]/[T]/[K]/[G] thành huy hiệu màu
			remarkPlugins: [remarkMath, [remarkNhan, { base: BASE, anSoSachNen: true }]],
			rehypePlugins: [rehypeKatex],
		}),
	},
	integrations: [
		starlight({
			title: 'Nhũ tương thực phẩm',
			description:
				'Kiến thức nhũ tương thực phẩm bằng tiếng Việt cho người làm R&D: mỗi khẳng định có nhãn mức tin cậy và nguồn.',
			defaultLocale: 'root',
			locales: { root: { label: 'Tiếng Việt', lang: 'vi' } },
			customCss: [
				'@fontsource/be-vietnam-pro/400.css',
				'@fontsource/be-vietnam-pro/600.css',
				'@fontsource/be-vietnam-pro/700.css',
				'@fontsource/jetbrains-mono/400.css',
				'@fontsource/jetbrains-mono/600.css',
				'katex/dist/katex.min.css',
				'./src/styles/nhan.css',
				'./src/styles/may-tinh.css',
				'./src/styles/giao-dien.css',
				'./src/styles/chung.css',
				'./src/styles/trang-chu.css',
				'./src/styles/cong-cu.css',
			],
			logo: { src: './src/assets/logo.svg' },
			components: {
				Hero: './src/components/Hero.astro',
				PageTitle: './src/components/PageTitle.astro',
			},
			head: [
				{ tag: 'script', attrs: { type: 'module', src: `${BASE}/may-tinh.js` } },
				{ tag: 'script', attrs: { type: 'module', src: `${BASE}/tuong-tac.js` } },
				{ tag: 'script', attrs: { type: 'module', src: `${BASE}/chan-doan.js` } },
			],
			lastUpdated: false,
			pagination: true,
			sidebar: [
				{
					label: 'Bắt đầu',
					items: [
						{ label: 'Giới thiệu', link: '/' },
						{ label: 'Cách đọc nhãn tin cậy', slug: 'quy-uoc' },
					],
				},
				// mỗi khu: trang lộ trình + các bài theo thứ tự trong src/data/khu.mjs
				...THU_TU_KHU.map((k) => ({
					label: KHU[k].ten,
					collapsed: k !== 'nhu-tuong',
					items: [
						{ label: 'Lộ trình đọc', slug: k },
						...KHU[k].bai.map((b) => ({ label: b.ten, slug: `${k}/${b.slug}` })),
					],
				})),
				{
					label: 'Công cụ',
					items: [
						{ label: 'Máy tính', slug: 'may-tinh' },
						{ label: 'Chẩn đoán sự cố', slug: 'chan-doan' },
					],
				},
				{
					label: 'Tra cứu',
					items: [
						{ label: 'Phụ gia theo mã INS/E', slug: 'tra-cuu-phu-gia' },
						{ label: 'Thuật ngữ Việt–Anh', slug: 'nhu-tuong/thuat-ngu' },
						{ label: 'Nguồn', slug: 'nguon' },
					],
				},
			],
		}),
	],
});
