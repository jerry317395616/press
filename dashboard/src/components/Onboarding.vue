<template>
	<div class="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
		<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
			<div>
				<h1 class="text-2xl font-semibold tracking-tight text-ink-gray-9">欢迎回来，{{ accountName }}</h1>
				<p class="mt-1 text-base text-ink-gray-7">用几步完成你的第一个中国区站点。</p>
			</div>
			<Button route="/support" variant="ghost" class="text-ink-blue-3">查看建站说明</Button>
		</div>

		<div class="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]">
			<section class="rounded-xl border border-outline-gray-2 bg-surface-white p-5 shadow-sm">
				<div class="flex items-start justify-between gap-3">
					<div>
						<h2 class="text-lg font-medium text-ink-gray-9">开始使用</h2>
						<p class="mt-1 text-sm text-ink-gray-7">完成以下 3 步即可访问你的站点。</p>
					</div>
					<span class="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">{{ progressLabel }}</span>
				</div>

				<div class="mt-5 h-1.5 overflow-hidden rounded-full bg-surface-gray-2" role="progressbar" aria-label="建站进度" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="progressValue">
					<div class="h-full rounded-full bg-blue-500 transition-all" :style="{ width: `${progressValue}%` }"></div>
				</div>

				<div class="mt-5 space-y-3">
					<div class="flex items-center gap-3 rounded-lg border border-outline-gray-2 px-3 py-3">
						<TextInsideCircle class="bg-green-600 text-white">1</TextInsideCircle>
						<div class="min-w-0 flex-1"><div class="text-sm font-medium text-ink-gray-9">账号已创建</div><div class="mt-0.5 text-xs text-ink-gray-7">登录信息已准备好</div></div>
						<lucide-check class="h-4 w-4 text-green-600" />
					</div>

					<div class="rounded-lg border border-blue-200 bg-blue-50/40 px-3 py-3">
						<div class="flex items-center gap-3">
							<TextInsideCircle class="bg-blue-600 text-white">2</TextInsideCircle>
							<div class="min-w-0 flex-1"><div class="text-sm font-medium text-ink-gray-9">创建第一个站点</div><div class="mt-0.5 text-xs text-ink-gray-7">选择应用、版本和站点名称</div></div>
							<Button :route="{ name: 'SignupAppSelector' }" variant="solid">开始创建</Button>
						</div>
						<div v-if="pendingSiteRequest" class="ml-9 mt-3 rounded-md bg-surface-white px-3 py-2 text-xs text-ink-gray-7">
							<span v-if="pendingSiteRequest.status === 'Error'">站点创建遇到问题，请打开支持中心查看处理方式。</span>
							<span v-else>正在准备 {{ pendingSiteRequest.title }}，可以继续完成站点设置。</span>
						</div>
					</div>

					<div class="flex items-center gap-3 rounded-lg border border-outline-gray-2 px-3 py-3" :class="{ 'opacity-60': !currentSite }">
						<TextInsideCircle>3</TextInsideCircle>
						<div class="min-w-0 flex-1"><div class="text-sm font-medium text-ink-gray-9">初始化完成</div><div class="mt-0.5 text-xs text-ink-gray-7">站点可访问后会显示在这里</div></div>
						<lucide-check v-if="currentSite" class="h-4 w-4 text-green-600" /><span v-else class="text-xs text-ink-gray-6">待完成</span>
					</div>
				</div>
			</section>

			<aside class="rounded-xl border border-outline-gray-2 bg-surface-white p-5 shadow-sm">
				<div><h2 class="text-lg font-medium text-ink-gray-9">默认配置</h2><p class="mt-1 text-sm text-ink-gray-7">新站点会自动使用这些设置。</p></div>
				<div class="mt-4 divide-y divide-outline-gray-2">
					<div v-for="item in defaults" :key="item.label" class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
						<div class="flex min-w-0 items-center gap-2 text-sm text-ink-gray-7"><span class="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-blue-50 text-xs font-medium text-blue-600">{{ item.icon }}</span><span>{{ item.label }}</span></div>
						<span class="text-right text-xs font-medium text-ink-gray-9">{{ item.value }}</span>
					</div>
				</div>
			</aside>
		</div>

		<section class="mt-5">
			<div class="mb-2 flex items-center justify-between"><h2 class="text-base font-medium text-ink-gray-9">我的站点</h2><Button route="/sites" variant="ghost" class="text-ink-blue-3">查看全部</Button></div>
			<div v-if="currentSite" class="rounded-xl border border-outline-gray-2 bg-surface-white p-5 shadow-sm">
				<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
					<div class="flex items-center gap-3"><div class="grid h-10 w-10 place-items-center rounded-lg bg-green-50 text-green-700">☁</div><div><div class="flex items-center gap-2 text-sm font-medium text-ink-gray-9">{{ currentSite.host_name || currentSite.name }}<span class="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">{{ siteStatus }}</span></div><div class="mt-1 text-xs text-ink-gray-7">Frappe v17 · 中国区 · 最近刚刚更新</div></div></div>
					<div class="flex gap-2"><a class="rounded-md border border-outline-gray-2 px-3 py-2 text-xs font-medium text-ink-gray-8 hover:bg-surface-gray-1" :href="`https://${currentSite.host_name || currentSite.name}`" target="_blank">打开站点</a><Button route="/sites" variant="solid">管理站点</Button></div>
				</div>
			</div>

			<div v-else class="flex flex-col justify-between gap-4 rounded-xl border border-dashed border-outline-gray-3 bg-surface-white px-5 py-4 shadow-sm sm:flex-row sm:items-center">
				<div class="flex items-center gap-3"><div class="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-xl text-blue-600">＋</div><div><div class="text-sm font-medium text-ink-gray-9">还没有站点</div><div class="mt-1 text-xs text-ink-gray-7">创建后可在这里查看域名、版本和运行状态。</div></div></div>
				<Button :route="{ name: 'SignupAppSelector' }" variant="solid">立即创建站点</Button>
			</div>
		</section>

		<section class="mt-5">
			<div class="mb-2 flex items-center justify-between"><h2 class="text-base font-medium text-ink-gray-9">常用操作</h2><span class="text-xs text-ink-gray-6">根据当前状态显示</span></div>
			<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
				<Button :route="{ name: 'SignupAppSelector' }" variant="outline" class="justify-start gap-2"><span class="text-lg text-blue-600">＋</span>新建站点</Button>
				<Button route="/apps" variant="outline" class="justify-start gap-2"><span class="text-lg text-blue-600">⌘</span>导入 GitHub 应用</Button>
				<Button route="/sites" variant="outline" class="justify-start gap-2"><span class="text-lg text-blue-600">⌁</span>添加域名</Button>
				<Button route="/sites" variant="outline" class="justify-start gap-2"><span class="text-lg text-blue-600">↻</span>备份与恢复</Button>
			</div>
		</section>

		<p class="mt-4 text-xs text-ink-gray-6">当前使用中国区默认设置 · 账单设置为可选项，不影响免费站点创建。</p>
	</div>
</template>

<script>
import TextInsideCircle from './TextInsideCircle.vue';

export default {
	name: 'Onboarding',
	components: { TextInsideCircle },
	resources: {
		home() {
			if (!this.$team.doc?.name) return;
			return {
				url: 'press.api.client.run_doc_method',
				cache: ['home_data', this.$team.doc.name],
				makeParams() {
					return {
						dt: 'Team',
						dn: this.$team.doc.name,
						method: 'get_home_data',
					};
				},
				auto: true,
			};
		},
	},
	computed: {
		accountName() {
			return this.$team.doc?.user || this.$team.doc?.owner || this.$team.doc?.email || this.$team.doc?.name || '你的账户';
		},
		pendingSiteRequest() {
			return this.$team.doc?.pending_site_request;
		},
		currentSite() {
			return this.$resources.home.data?.message?.sites?.[0];
		},
		progressValue() {
			return this.currentSite ? 100 : 42;
		},
		progressLabel() {
			return this.currentSite ? '已完成' : '进行中';
		},
		siteStatus() {
			const labels = {
				Active: '运行中',
				Installing: '安装中',
				Updating: '更新中',
				Inactive: '未启用',
				Suspended: '已暂停',
				Broken: '异常',
			};
			return labels[this.currentSite?.status] || this.currentSite?.status || '运行中';
		},
		defaults() {
			return [
				{ icon: '▦', label: '应用与版本', value: 'GitHub · Frappe v17' },
				{ icon: '◎', label: '国家/地区', value: '中国' },
				{ icon: '◷', label: '时区', value: 'Asia/Shanghai' },
				{ icon: '¥', label: '货币', value: '人民币（CNY）' },
				{ icon: '⌁', label: '代码分支', value: 'develop' },
			];
		},
	},
};
</script>
