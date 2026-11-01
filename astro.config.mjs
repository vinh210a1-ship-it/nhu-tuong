// Cấu hình web. Astro = bộ dựng web tĩnh; Starlight = khuôn web tài liệu (thanh bên, tìm kiếm, nền tối).
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkNhan from './src/plugins/remark-nhan.mjs';

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
			],
			logo: { src: './src/assets/logo.svg' },
			components: {
				Hero: './src/components/Hero.astro',
				PageTitle: './src/components/PageTitle.astro',
			},
			head: [
				{ tag: 'script', attrs: { type: 'module', src: `${BASE}/may-tinh.js` } },
				{ tag: 'script', attrs: { type: 'module', src: `${BASE}/tuong-tac.js` } },
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
				{
					label: 'Nhũ tương',
					items: [
						{ label: 'Lộ trình đọc', slug: 'nhu-tuong' },
						{ label: '1. Nền tảng', slug: 'nhu-tuong/nen-tang' },
						{ label: '2. Hình thành', slug: 'nhu-tuong/hinh-thanh' },
						{ label: '3. Mất ổn định', slug: 'nhu-tuong/mat-on-dinh' },
						{ label: '4. Ổn định', slug: 'nhu-tuong/chat-on-dinh' },
						{ label: '5. Đo lường', slug: 'nhu-tuong/do-luong' },
						{ label: '6. Sản phẩm', slug: 'nhu-tuong/san-pham' },
						{ label: 'Chuyên sâu: hệ đặc biệt', slug: 'nhu-tuong/he-dac-biet' },
						{ label: 'Thực hành: xử lý sự cố', slug: 'nhu-tuong/su-co-thiet-ke' },
					],
				},
				{
					label: 'Công cụ',
					items: [
						{ label: 'Phòng lab ảo', slug: 'phong-lab', badge: { text: 'Mới', variant: 'tip' } },
						{ label: 'Máy tính', slug: 'may-tinh' },
					],
				},
				{
					label: 'Tra cứu',
					items: [
						{ label: 'Thuật ngữ Việt–Anh', slug: 'nhu-tuong/thuat-ngu' },
						{ label: 'Nguồn', slug: 'nguon' },
					],
				},
			],
		}),
	],
});
