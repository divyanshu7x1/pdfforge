import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { pageNumberService } from './page-number.service';

async function createPdfBuffer(pages = 2): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pages; i++) doc.addPage([500, 500]);
  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe('PageNumberService', () => {
  it('should add page numbers to PDF pages', async () => {
    const pdfBuf = await createPdfBuffer(2);
    const numberedBuf = await pageNumberService.addPageNumbers(pdfBuf, {
      format: 'Page {page} of {total}',
      position: 'bottom-center'
    });

    const doc = await PDFDocument.load(numberedBuf);
    expect(doc.getPageCount()).toBe(2);
    expect(numberedBuf.length).toBeGreaterThan(pdfBuf.length);
  });
});
