import generatedTranslations from './zh-CN.json'

// Keep the most visible product terms consistent across the dashboard.
const preferredTranslations = {
	'Frappe Cloud': 'Frappe 云',
	'Sites': '站点',
	'Site': '站点',
	'Benches': '运行环境',
	'Bench': '运行环境',
	'Servers': '服务器',
	'Server': '服务器',
	'New Site': '新建站点',
	'Actions': '操作',
	'Show popup': '显示选项',
	'Active': '运行中',
	'Inactive': '未启用',
	'Installing': '安装中',
	'Suspended': '已暂停',
	'Broken': '异常',
	'Archived': '已归档',
	'Shared': '共享',
	'Self-Hosted Free': '本机免费',
	'Version 15': '版本 15',
}

const translations = { ...generatedTranslations, ...preferredTranslations }
const displayAttributes = ['placeholder', 'title', 'aria-label', 'alt']
const excludedAncestors = 'script, style, code, pre, textarea, [contenteditable], [data-no-translate]'

export function translateUiText(original) {
	if (typeof original !== 'string') return original
	const normalized = original.replace(/\s+/g, ' ').trim()
	if (!normalized) return original
	const selectedStatuses = normalized.split(/,\s*/)
	const statusSummary =
		selectedStatuses.length > 1 &&
		selectedStatuses.every((status) =>
			['Installing', 'Active', 'Inactive', 'Suspended', 'Broken', 'Archived'].includes(status),
		)
			? selectedStatuses.map((status) => translations[status]).join('、')
			: null
	const translated =
		translations[normalized] ?? statusSummary ?? normalized.replace(/^Version (\d+)$/, '版本 $1')
	if (translated === normalized) return original
	return `${original.match(/^\s*/)?.[0] ?? ''}${translated}${original.match(/\s*$/)?.[0] ?? ''}`
}

function translateElement(element) {
	if (element.closest(excludedAncestors)) return
	for (const attribute of displayAttributes) {
		const original = element.getAttribute(attribute)
		if (original == null) continue
		const translated = translateUiText(original)
		if (translated !== original) element.setAttribute(attribute, translated)
	}
}

function translateTree(root) {
	if (root.nodeType === Node.TEXT_NODE) {
		if (root.parentElement?.closest(excludedAncestors)) return
		const translated = translateUiText(root.nodeValue)
		if (translated !== root.nodeValue) root.nodeValue = translated
		return
	}
	if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return
	if (root.nodeType === Node.ELEMENT_NODE) translateElement(root)
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
	while (walker.nextNode()) {
		const node = walker.currentNode
		if (node.nodeType === Node.TEXT_NODE) {
			if (node.parentElement?.closest(excludedAncestors)) continue
			const translated = translateUiText(node.nodeValue)
			if (translated !== node.nodeValue) node.nodeValue = translated
		} else {
			translateElement(node)
		}
	}
}

export function installChineseUi() {
	document.documentElement.lang = 'zh-CN'
	translateTree(document.documentElement)

	const pending = new Set()
	let scheduled = false
	const flush = () => {
		scheduled = false
		for (const node of pending) translateTree(node)
		pending.clear()
	}
	const observer = new MutationObserver((records) => {
		for (const record of records) {
			if (record.type === 'childList') {
				for (const node of record.addedNodes) pending.add(node)
			} else {
				pending.add(record.target)
			}
		}
		if (pending.size && !scheduled) {
			scheduled = true
			queueMicrotask(flush)
		}
	})
	observer.observe(document.documentElement, {
		childList: true,
		characterData: true,
		attributes: true,
		attributeFilter: displayAttributes,
		subtree: true,
	})
	return observer
}
