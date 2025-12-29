import fs from 'fs';
import path from 'path';

const a = fs.readFileSync(path.resolve('test_a.pdf'));
const b = fs.readFileSync(path.resolve('test_b.pdf'));

const form = new FormData();
form.append('file', new Blob([a]), 'test_a.pdf');
form.append('file', new Blob([b]), 'test_b.pdf');

const res = await fetch('http://localhost:3001/api/merge-pdf', { method: 'POST', body: form });
if (!res.ok) {
  console.error('Merge request failed', res.status, await res.text());
  process.exit(1);
}
const arr = new Uint8Array(await res.arrayBuffer());
fs.writeFileSync('merged_test.pdf', arr);
console.log('Wrote merged_test.pdf');
