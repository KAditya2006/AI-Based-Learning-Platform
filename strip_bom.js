const fs = require('fs');
const file = 'package.json';
let data = fs.readFileSync(file, 'utf8');
if (data.charCodeAt(0) === 0xFEFF) {
  data = data.slice(1);
  fs.writeFileSync(file, data, 'utf8');
  console.log('BOM stripped successfully');
} else {
  console.log('No BOM found');
}
