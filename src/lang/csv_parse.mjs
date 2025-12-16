import fs from 'node:fs';

const inputFilePath = './interface_v2.tsv';
const csv_locale_content = fs.readFileSync(inputFilePath, 'utf8');
// перем заголовок
const csv_locale_content_rows = csv_locale_content.split(/\r\n|\n\r|\n|\r/);

const header = csv_locale_content_rows.shift().split('\t');

const header_locale = [];

for (let i = 1; i < header.length; i++) {
	let loc = header[i].match(RegExp('(?<=\\[).+(?=\\])'));
	if (loc) {
		header_locale.push(loc[0]);
	}
}
// формируем json
const result = header_locale.reduce((acc, curr) => ((acc[curr] = {}), acc), {});

const output = {};
for (let i = 0; i < csv_locale_content_rows.length; i++) {
	let row = csv_locale_content_rows[i].split('\t');

	let col_key = row[0].split('.');
	let col_key_str = row[0];
	if (!row[0]) {
		continue;
	}
	for (let j = 1; j < row.length; j++) {
		let locale = header_locale[j - 1];
		let value = row[j];

		result[locale][col_key_str] = value;
	}
}
function deepen(obj) {
	const result = {};

	// For each object path (property key) in the object
	for (const objectPath in obj) {
		// Split path into component parts
		const parts = objectPath.split('.');

		// Create sub-objects along path as needed
		let target = result;
		while (parts.length > 1) {
			const part = parts.shift();
			target = target[part] = target[part] || {};
		}

		// Set value at end of path
		target[parts[0]] = obj[objectPath];
	}

	return result;
}

Object.entries(result).forEach((entry) => {
	const [key, value] = entry;
	let lang_json = deepen(value);
	fs.writeFileSync('./' + key + '.json', Buffer.from(JSON.stringify(lang_json, null, 2)), 'utf8');
});
