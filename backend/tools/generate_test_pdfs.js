import { PDFDocument, StandardFonts } from 'pdf-lib';
import fs from 'fs';

async function makePdf(path, text) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 200]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.drawText(text, { x: 50, y: 100, size: 14, font });
  const bytes = await pdfDoc.save();
  fs.writeFileSync(path, bytes);
  console.log('Wrote', path);
}

(async () => {
  await makePdf('test_a.pdf', 'Test PDF A');
  await makePdf('test_b.pdf', 'Test PDF B');
})();
