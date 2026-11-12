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
	// trang tra cứu phụ gia cũ đã gộp vào trang Tra cứu (tab Mã INS/E)
	redirects: { '/tra-cuu-phu-gia': `${BASE}/tra-cuu/#ins` },
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
				'./src/styles/ban-do.css',
				'./src/styles/hinh.css',
				'./src/styles/do-thi.css',
			],
			logo: { src: './src/assets/logo.svg' },
			components: {
				Head: './src/components/Head.astro',
				Hero: './src/components/Hero.astro',
				PageTitle: './src/components/PageTitle.astro',
				Footer: './src/components/Footer.astro',
			},
			head: [
				{ tag: 'script', attrs: { type: 'module', src: `${BASE}/may-tinh.js` } },
				{ tag: 'script', attrs: { type: 'module', src: `${BASE}/tuong-tac.js` } },
				{ tag: 'script', attrs: { type: 'module', src: `${BASE}/do-thi.js` } },
				{ tag: 'script', attrs: { type: 'module', src: `${BASE}/chan-doan.js` } },
				{ tag: 'script', attrs: { type: 'module', src: `${BASE}/tra-cuu.js` } },
				{ tag: 'script', attrs: { type: 'module', src: `${BASE}/tt24.js` } },
				{ tag: 'script', attrs: { type: 'module', src: `${BASE}/ta-duoc.js` } },
				{ tag: 'script', attrs: { type: 'module', src: `${BASE}/bao-loi.js` } },
				{ tag: 'script', attrs: { type: 'module', src: `${BASE}/chu-giai.js` } },
				{ tag: 'script', attrs: { type: 'module', src: `${BASE}/trich-dan.js` } },
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
						...[...KHU[k].bai, ...(KHU[k].phu || [])].map((b) => ({ label: b.ten, slug: `${k}/${b.slug}` })),
					],
				})),
				{
					label: 'Công cụ',
					items: [
						{ label: 'Phòng lab ảo', slug: 'phong-lab', badge: { text: 'Mới', variant: 'tip' } },
						{ label: 'Máy tính', slug: 'may-tinh' },
						{ label: 'Chẩn đoán sự cố', slug: 'chan-doan' },
					],
				},
				{
					label: 'Tra cứu',
					items: [
						{ label: 'Mã INS, mức tối đa TT24, từ điển', slug: 'tra-cuu', badge: { text: 'Mới', variant: 'tip' } },
						{ label: 'Tá dược (FDA IID)', slug: 'tra-cuu-ta-duoc', badge: { text: 'Mới', variant: 'tip' } },
						{ label: 'Số liệu R&D (bảng tra)', slug: 'so-lieu-rnd', badge: { text: 'Mới', variant: 'tip' } },
						{ label: 'Thuật ngữ nhũ tương (bảng)', slug: 'nhu-tuong/thuat-ngu' },
						{ label: 'Nguồn', slug: 'nguon' },
						{ label: 'Nhật ký thay đổi', slug: 'nhat-ky-thay-doi' },
						{ label: 'Giấy phép và trích dẫn', slug: 'giay-phep' },
					],
				},
			],
		}),
	],
});
