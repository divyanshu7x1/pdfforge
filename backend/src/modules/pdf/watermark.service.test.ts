import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { watermarkService } from './watermark.service';

async function createPdfBuffer(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  doc.addPage([500, 500]);
  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe('WatermarkService', () => {
  it('should apply watermark text overlay onto PDF pages', async () => {
    const pdfBuf = await createPdfBuffer();
    const watermarkedBuf = await watermarkService.addWatermark(pdfBuf, {
      text: 'CONFIDENTIAL',
      fontSize: 32,
      opacity: 0.5
    });

    const doc = await PDFDocument.load(watermarkedBuf);
    expect(doc.getPageCount()).toBe(1);
    expect(watermarkedBuf.length).toBeGreaterThan(pdfBuf.length);
  });
});
