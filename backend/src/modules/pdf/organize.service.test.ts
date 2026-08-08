import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { organizeService } from './organize.service';

describe('OrganizeService', () => {
  it('deletes and reorders pages in a PDF document', async () => {
    const doc = await PDFDocument.create();
    const p1 = doc.addPage([500, 500]);
    p1.drawText('Page 1');
    const p2 = doc.addPage([500, 500]);
    p2.drawText('Page 2');
    const p3 = doc.addPage([500, 500]);
    p3.drawText('Page 3');
    const pdfBytes = await doc.save();
    const inputBuffer = Buffer.from(pdfBytes);

    // Delete page 2, order as 3, 1
    const organizedBuffer = await organizeService.organizePdf(inputBuffer, '3,1', '2');
    expect(organizedBuffer).toBeInstanceOf(Buffer);
    expect(organizedBuffer.subarray(0, 4).toString()).toBe('%PDF');

    const resultDoc = await PDFDocument.load(organizedBuffer);
    expect(resultDoc.getPageCount()).toBe(2);
  });
});
