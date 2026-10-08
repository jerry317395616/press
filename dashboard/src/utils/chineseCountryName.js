const chineseRegionNames = new Intl.DisplayNames(['zh-CN'], { type: 'region' })

export function getChineseCountryName(country) {
	if (!country?.code) return country?.name || ''

	const code = country.code.toUpperCase()
	const translated = chineseRegionNames.of(code)
	return translated && translated !== code ? translated : country.name
}
