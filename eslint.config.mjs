import pluginVue from 'eslint-plugin-vue';
import eslint from '@eslint/js';
import tslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import tsParser from '@typescript-eslint/parser';
import vueParser from 'vue-eslint-parser';
import withNuxt from './.nuxt/eslint.config.mjs';
const tsConfig = tslint.config(
	eslint.configs.recommended,
	eslintConfigPrettier,
	...tslint.configs.recommended,
	...pluginVue.configs['flat/essential'],
	{
		languageOptions: {
			parser: vueParser,
			parserOptions: {
				parser: tsParser,
				project: './tsconfig.json',
				tsconfigRootDir: import.meta.dirname,
				ecmaVersion: 'latest',
				sourceType: 'module',
				extraFileExtensions: ['.vue'],
			},
		},
		rules: {
			curly: 'warn',
			camelcase: 'warn',
			'no-empty': 'warn',
			'no-useless-escape': 'warn',

			'import/order': 'off',

			'@typescript-eslint/ban-ts-comment': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': 'warn',

			'vue/html-indent': 'off',
			'vue/max-attributes-per-line': 'off',
			'vue/multi-word-component-names': 'off',

			'vue/no-deprecated-slot-attribute': 'off',
		},
	}
);

export default withNuxt([
	...tsConfig,
	{
		ignores: ['output/**', '.nuxt/**', '.idea/**', 'src/public/**', 'node_modules'],
	},
]);
