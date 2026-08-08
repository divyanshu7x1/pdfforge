import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { convertService } from './convert.service';

describe('ConvertService', () => {
  it('converts plain text or HTML containing smart quotes, dashes and bullets to PDF', async () => {

    const sampleHtml = `
      <h1>Special Characters & Entity Test</h1>
      <p>Smart quotes: “Hello World” &lsquo;Testing&rsquo;</p>
      <p>Em-dash: Long &mdash; dash test</p>
      <p>Bullets: &bull; Item 1 &bull; Item 2</p>
      <p>Entities: &nbsp; &amp; &quot; &lt; &gt;</p>
    `;

    const pdfBuffer = await convertService.textOrHtmlToPdf(sampleHtml, true);
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.subarray(0, 4).toString()).toBe('%PDF');
  });

  it('converts images into a valid PDF document', async () => {
    const pngImageBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 }
      }
    }).png().toBuffer();

    const pdfBuffer = await convertService.imagesToPdf([
      {
        originalname: 'test.png',
        mimetype: 'image/png',
        buffer: pngImageBuffer
      }
    ]);

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.subarray(0, 4).toString()).toBe('%PDF');
  });

  it('extracts PDF pages as PNG images packaged in a ZIP archive', async () => {
    const doc = await PDFDocument.create();
    doc.addPage([400, 400]);
    doc.addPage([400, 400]);
    const pdfBytes = await doc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    const result = await convertService.pdfToImages(pdfBuffer);
    expect(result.filename).toBe('pdf-pages-images.zip');
    expect(result.mimeType).toBe('application/zip');
    expect(result.buffer).toBeInstanceOf(Buffer);
    expect(result.buffer.length).toBeGreaterThan(50);
  });
});
