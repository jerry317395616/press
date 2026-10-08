// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { installChineseUi, translateUiText } from './index'
import { pageTitle } from '../utils/title'

describe('Chinese dashboard', () => {
	afterEach(() => {
		document.body.innerHTML = ''
	})

	it('translates visible labels without changing technical identifiers', () => {
		expect(translateUiText(' Sites ')).toBe(' 站点 ')
		expect(translateUiText('Version 15')).toBe('版本 15')
		expect(translateUiText('Show popup')).toBe('显示选项')
		expect(translateUiText('press-demo.myyr.top')).toBe('press-demo.myyr.top')
		expect(pageTitle('Sites')).toBe('站点 - Frappe 云')
	})

	it('translates newly inserted dialogue content', async () => {
		const observer = installChineseUi()
		const button = document.createElement('button')
		button.textContent = 'New Site'
		button.title = 'Search sites'
		const username = document.createElement('span')
		username.dataset.noTranslate = ''
		username.textContent = 'Administrator'
		document.body.append(button)
		document.body.append(username)
		await new Promise((resolve) => setTimeout(resolve, 0))
		expect(button.textContent).toBe('新建站点')
		expect(button.title).toBe('搜索站点')
		expect(username.textContent).toBe('Administrator')
		observer.disconnect()
	})
})
