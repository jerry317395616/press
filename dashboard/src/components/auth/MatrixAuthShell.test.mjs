import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { compileTemplate, parse } from '@vue/compiler-sfc';

const componentDirectory = dirname(fileURLToPath(import.meta.url));
const shellSource = readFileSync(resolve(componentDirectory, 'MatrixAuthShell.vue'), 'utf8');
const loginSource = readFileSync(resolve(componentDirectory, '../../pages/LoginSignup.vue'), 'utf8');

test('Matrix authentication shell compiles and exposes both account tabs', () => {
	const { descriptor, errors } = parse(shellSource, { filename: 'MatrixAuthShell.vue' });
	assert.deepEqual(errors, []);
	const compiled = compileTemplate({
		source: descriptor.template.content,
		filename: 'MatrixAuthShell.vue',
		id: 'matrix-auth-shell',
	});
	assert.deepEqual(compiled.errors, []);
	assert.match(descriptor.script.content, /name: 'Login'/);
	assert.match(descriptor.script.content, /name: 'Signup'/);
});

test('redesign keeps the existing Press authentication handlers', () => {
	const { descriptor, errors } = parse(loginSource, { filename: 'LoginSignup.vue' });
	assert.deepEqual(errors, []);
	assert.match(descriptor.template.content, /<MatrixAuthShell/);
	for (const endpoint of [
		'press.api.account.signup',
		'press.api.account.verify_otp',
		'press.api.account.send_otp',
		'press.api.account.verify_otp_and_login',
		'press.api.account.send_reset_password_email',
		'press.api.account.verify_2fa',
	]) {
		assert.ok(descriptor.script.content.includes(endpoint), `${endpoint} must remain connected`);
	}
});
