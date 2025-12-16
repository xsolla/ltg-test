import fs from 'node:fs';

let output = {};
export const traverse = (obj, parentKey = '') => {
	for (const [key, value] of Object.entries(obj)) {
		if (!key || !value) {
			continue;
		}

		const outputKey = parentKey !== '' ? `${parentKey}.${key}` : key;

		if (typeof value === 'object') {
			traverse(value, outputKey);
		} else {
			output[outputKey] = value;
		}
	}
	return output;
};

function compare(inputFilePath) {
	if (!inputFilePath) {
		throw new Error('oh no');
	}
	const compareToFilePath = './default-en.json';
	const localeToCompareData = JSON.parse(fs.readFileSync(compareToFilePath, 'utf8'));

	const localeData = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));

	// Объект с дефолтными ключами, с которыми сравниваем
	const localeToCompareDataResult = traverse(localeToCompareData);
	output = {};
	// Объект с ключами файла, который сравнивать будем с дефолтными
	const localeDataResult = traverse(localeData);

	const keys = Object.keys(localeToCompareDataResult);

	const missingKeys = [];
	keys.forEach((key) => {
		if (!localeDataResult[key]) {
			missingKeys.push(key);
		}
	});
	if (missingKeys.length) {
		console.error('Отсутствуют ключи:');
		missingKeys.forEach((k) => console.log(k));
		return;
	}
	console.info('All done, no missing keys');
}

compare('./en.json');
