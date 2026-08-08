import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { compressService } from './compress.service';

describe('CompressService', () => {
  it('compresses PDF document streams and returns valid PDF buffer', async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([500, 500]);
    page.drawText('Stream compression test content');
    const pdfBytes = await doc.save();
    const inputBuffer = Buffer.from(pdfBytes);

    const compressedBuffer = await compressService.compressPdf(inputBuffer, 'medium');
    expect(compressedBuffer).toBeInstanceOf(Buffer);
    expect(compressedBuffer.subarray(0, 4).toString()).toBe('%PDF');
  });
});
