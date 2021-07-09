const { parseHocon } = require('@tkint/hocon-parser');

const hocon = 'hello = "world"';
const parsed = parseHocon(hocon);

console.log(parsed);
