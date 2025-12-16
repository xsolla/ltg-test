import fs from 'node:fs';

const inputFilePath = './en.json';
const outputFilePath = './en-keys.csv';

const locale = JSON.parse(fs.readFileSync(inputFilePath, 'utf8'));
const output = {};

const traverse = (obj, parentKey = '') => {
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

const result = traverse(locale);

function toCSV(data) {
	let output = '';
	for (const [key, value] of Object.entries(data)) {
		output += `${key}:${value}\n`;
	}

	fs.writeFileSync(outputFilePath, Buffer.from(output), 'utf8');
}

function toJSON(data) {
	fs.writeFileSync(outputFilePath, Buffer.from(JSON.stringify(data, null, 2)), 'utf8');
}

toCSV(result);
