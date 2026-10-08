import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { compileTemplate, parse } from '@vue/compiler-sfc';
import { getChineseCountryName } from '../utils/chineseCountryName.js';

const pageDirectory = dirname(fileURLToPath(import.meta.url));
const setupSource = readFileSync(resolve(pageDirectory, 'SetupAccount.vue'), 'utf8');
const phoneSource = readFileSync(resolve(pageDirectory, '../components/PhoneInput.vue'), 'utf8');

test('country labels use Chinese while the submitted values remain English names', () => {
	assert.equal(getChineseCountryName({ name: 'China', code: 'CN' }), '中国');
	assert.equal(getChineseCountryName({ name: 'United States', code: 'US' }), '美国');
	assert.equal(getChineseCountryName({ name: 'Unknown', code: '' }), 'Unknown');
	assert.match(setupSource, /value: country\.name/);
	assert.match(setupSource, /res\.is_invitation \? res\.country : 'China'/);
});

test('Chinese account setup and phone input templates compile', () => {
	for (const [filename, source] of [
		['SetupAccount.vue', setupSource],
		['PhoneInput.vue', phoneSource],
	]) {
		const { descriptor, errors } = parse(source, { filename });
		assert.deepEqual(errors, []);
		const compiled = compileTemplate({
			source: descriptor.template.content,
			filename,
			id: filename,
		});
		assert.deepEqual(compiled.errors, []);
	}
	assert.match(setupSource, /press\.api\.account\.setup_account/);
	assert.match(setupSource, /press\.api\.account\.accept_team_invite/);
});
