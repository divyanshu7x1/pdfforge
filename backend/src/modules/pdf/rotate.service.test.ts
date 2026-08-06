import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { rotateService } from './rotate.service';

async function createPdfBuffer(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  doc.addPage([500, 500]);
  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe('RotateService', () => {
  it('should rotate PDF pages by specified angle', async () => {
    const pdfBuf = await createPdfBuffer();
    const rotatedBuf = await rotateService.rotatePdf(pdfBuf, 90, 'all');

    const doc = await PDFDocument.load(rotatedBuf);
    const page = doc.getPage(0);
    expect(page.getRotation().angle).toBe(90);
  });
});
