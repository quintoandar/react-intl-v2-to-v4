import { join } from 'path';
import { readFileSync } from 'fs';

const helpText = readFileSync(join(__dirname, './help.txt'), 'utf8');

export { helpText };
