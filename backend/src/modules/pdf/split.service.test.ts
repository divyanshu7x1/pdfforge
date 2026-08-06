import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { splitService, parsePageRange } from './split.service';

async function createPdfBuffer(pageCount = 3): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    doc.addPage([500, 500]);
  }
  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe('SplitService', () => {
  it('should correctly parse page range strings', () => {
    expect(parsePageRange('1, 3', 5)).toEqual([0, 2]);
    expect(parsePageRange('1-3', 5)).toEqual([0, 1, 2]);
    expect(parsePageRange('all', 3)).toEqual([0, 1, 2]);
  });

  it('should split PDF into a single extracted PDF when range is specified', async () => {
    const pdfBuf = await createPdfBuffer(4);
    const result = await splitService.splitPdf(pdfBuf, '1-2');

    expect(result.mimeType).toBe('application/pdf');
    expect(result.filename).toBe('split-extracted.pdf');

    const extractedDoc = await PDFDocument.load(result.buffer);
    expect(extractedDoc.getPageCount()).toBe(2);
  });

  it('should split PDF into a ZIP file when multiple distinct pages are requested', async () => {
    const pdfBuf = await createPdfBuffer(3);
    const result = await splitService.splitPdf(pdfBuf, '1, 3');

    expect(result.mimeType).toBe('application/zip');
    expect(result.filename).toBe('split-pages.zip');
    expect(result.buffer.length).toBeGreaterThan(0);
  });
});
