import { PDFDocument } from 'pdf-lib';

/**
 * Merge multiple PDF buffers into a single PDF buffer.
 * @param {Array<Buffer>} pdfBuffers
 * @returns {Promise<Buffer>} merged PDF buffer
 */
export async function mergePDFFiles(pdfBuffers) {
  if (!pdfBuffers || pdfBuffers.length === 0) {
    throw new Error('No PDF buffers provided');
  }

  const mergedPdf = await PDFDocument.create();

  for (const buf of pdfBuffers) {
    // skip empty
    if (!buf || buf.length === 0) continue;
    try {
      const donorPdf = await PDFDocument.load(buf);
      const copiedPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    } catch (err) {
      console.warn('Skipping invalid PDF during merge:', err.message);
    }
  }

  const out = await mergedPdf.save();
  return Buffer.from(out);
}
