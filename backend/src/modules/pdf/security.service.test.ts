import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { securityService } from './security.service';

async function createPdfBuffer(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  doc.addPage([500, 500]);
  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe('SecurityService', () => {
  it('should encrypt PDF with password and successfully unlock it', async () => {
    const pdfBuf = await createPdfBuffer();
    const protectedBuf = await securityService.protectPdf(pdfBuf, 'secret123');

    expect(protectedBuf.length).toBeGreaterThan(0);

    const unlockedBuf = await securityService.unlockPdf(protectedBuf, 'secret123');
    const doc = await PDFDocument.load(unlockedBuf);
    expect(doc.getPageCount()).toBe(1);
  });
});
