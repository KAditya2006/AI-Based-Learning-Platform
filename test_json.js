const fs = require('fs');

const files = [
  'package.json',
  'apps/api/package.json',
  'apps/web/package.json'
];

for (const file of files) {
  try {
    const data = fs.readFileSync(file, 'utf8');
    JSON.parse(data);
    console.log(file + ' is OK');
  } catch (err) {
    console.error(file + ' FAILED: ' + err.message);
  }
}
