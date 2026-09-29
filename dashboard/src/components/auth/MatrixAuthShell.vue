<template>
	<div class="matrix-auth-page">
		<svg class="matrix-icon-library" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
			<symbol id="matrix-bolt" viewBox="0 0 24 24">
				<path d="m13.2 2-9 11h6.1L9.8 22l10-12h-6.2L13.2 2Z" fill="currentColor" />
			</symbol>
			<symbol id="matrix-grid" viewBox="0 0 24 24">
				<rect x="2" y="2" width="9" height="9" rx="2" fill="currentColor" />
				<rect x="13" y="2" width="9" height="9" rx="2" fill="currentColor" />
				<rect x="2" y="13" width="9" height="9" rx="2" fill="currentColor" />
				<rect x="13" y="13" width="9" height="9" rx="2" fill="currentColor" />
			</symbol>
			<symbol id="matrix-chart" viewBox="0 0 24 24">
				<rect x="2" y="13" width="5" height="9" rx="1.5" fill="currentColor" />
				<rect x="9.5" y="8" width="5" height="14" rx="1.5" fill="currentColor" />
				<rect x="17" y="2" width="5" height="20" rx="1.5" fill="currentColor" />
			</symbol>
			<symbol id="matrix-shield" viewBox="0 0 24 24">
				<path d="M12 2 21 5v6.6c0 5.1-3.4 8.5-9 10.4-5.6-1.9-9-5.3-9-10.4V5l9-3Z" fill="currentColor" />
				<path d="m8 12 2.5 2.5L16 9" fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
			</symbol>
		</svg>

		<header class="matrix-auth-header">
			<div class="matrix-brand" @dblclick="redirectForFrappeioAuth">
				<span class="matrix-mark" aria-hidden="true"><span></span><i></i></span>
				<span class="matrix-brand-type"><strong>MATRIX</strong><small>OPEN. CONNECT. EVOLVE.</small></span>
			</div>
			<span class="matrix-language" aria-label="当前语言：简体中文">
				<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>
				简体中文
			</span>
		</header>

		<main class="matrix-auth-layout">
			<section class="matrix-hero" aria-label="Matrix 平台介绍">
				<div class="matrix-hero-art" aria-hidden="true">
					<span class="matrix-art-main"></span><span class="matrix-art-top"></span><span class="matrix-art-side"></span>
				</div>
				<div class="matrix-hero-copy">
					<p class="matrix-eyebrow">OPEN MATRIX</p>
					<h1>让每个团队<br /><span>释放更大的可能</span></h1>
					<p class="matrix-hero-description">
						Matrix 是面向未来的数字化企业平台，<br class="matrix-desktop-break" />连接人、数据与工作流，帮助组织高效协作与成长。
					</p>
					<div class="matrix-features">
						<div v-for="feature in features" :key="feature.title" class="matrix-feature">
							<span class="matrix-feature-icon" aria-hidden="true"><svg><use :href="`#matrix-${feature.icon}`" /></svg></span>
							<span><strong>{{ feature.title }}</strong><small>{{ feature.description }}</small></span>
						</div>
					</div>
				</div>
			</section>

			<section class="matrix-auth-card" aria-label="账户登录和注册">
				<div class="matrix-card-brand">
					<span class="matrix-mark" aria-hidden="true"><span></span><i></i></span>
					<span class="matrix-brand-type"><strong>MATRIX</strong><small>OPEN. CONNECT. EVOLVE.</small></span>
				</div>
				<nav class="matrix-auth-tabs" aria-label="账户操作">
					<router-link :class="{ active: isLoginRoute }" :to="loginRoute">登录</router-link>
					<router-link :class="{ active: !isLoginRoute }" :to="signupRoute">注册</router-link>
				</nav>
				<div class="matrix-auth-form">
					<h2 class="sr-only">{{ title }}</h2>
					<p class="sr-only">{{ subtitle }}</p>
					<slot />
				</div>
			</section>
		</main>

		<footer class="matrix-auth-footer">
			<span>MATRIX — OPEN THE NEXT POSSIBILITY.</span>
			<span>© {{ new Date().getFullYear() }} MATRIX</span>
		</footer>
	</div>
</template>

<script>
import { toast } from 'vue-sonner';
import './matrix-auth.css';

export default {
	name: 'MatrixAuthShell',
	props: {
		title: { type: String, default: '' },
		subtitle: { type: String, default: '' },
	},
	data() {
		return {
			features: [
				{ icon: 'bolt', title: '快速上线', description: '从想法到价值，更快一步' },
				{ icon: 'grid', title: '灵活扩展', description: '随业务成长而进化' },
				{ icon: 'chart', title: '数据驱动', description: '用数据发现更好的决策' },
				{ icon: 'shield', title: '安全可靠', description: '企业级安全，守护每一份信任' },
			],
		};
	},
	computed: {
		isLoginRoute() {
			return this.$route.name === 'Login';
		},
		authQuery() {
			const query = { ...this.$route.query };
			delete query.forgot;
			delete query.two_factor;
			delete query.use_password;
			return query;
		},
		loginRoute() {
			return { name: 'Login', query: this.authQuery };
		},
		signupRoute() {
			return { name: 'Signup', query: this.authQuery };
		},
	},
	mounted() {
		if (new URLSearchParams(window.location.search).get('showRemoteLoginError')) {
			toast.error('登录凭证无效或已过期');
		}
	},
	methods: {
		redirectForFrappeioAuth() {
			window.location = '/f-login';
		},
	},
};
</script>
