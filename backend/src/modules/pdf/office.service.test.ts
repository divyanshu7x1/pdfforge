import { describe, expect, it } from 'vitest';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { officeService } from './office.service';

describe('OfficeService', () => {
  it('converts text extracted from PDF into a valid DOCX buffer', async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const page = doc.addPage([600, 400]);
    page.drawText('Sample text for PDF to Word conversion.', { font, size: 12, x: 50, y: 300 });
    const pdfBytes = await doc.save({ useObjectStreams: false });
    const pdfBuffer = Buffer.from(pdfBytes);

    const docxBuffer = await officeService.pdfToWord(pdfBuffer);
    expect(docxBuffer).toBeInstanceOf(Buffer);
    expect(docxBuffer.length).toBeGreaterThan(100);
  });

  it('converts Excel buffers into PDF documents', async () => {
    // Basic CSV/Excel buffer format
    const csvContent = 'Name,Age,Role\nAlice,30,Developer\nBob,25,Designer';
    const excelBuffer = Buffer.from(csvContent, 'utf-8');

    const pdfBuffer = await officeService.excelToPdf(excelBuffer);
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.subarray(0, 4).toString()).toBe('%PDF');
  });

  it('handles PowerPoint buffers and converts to PDF documents', async () => {
    const pptContent = '<?xml version="1.0"?><a:t>Slide 1 Title</a:t><a:t>Slide content text</a:t>';
    const pptBuffer = Buffer.from(pptContent, 'utf-8');

    const pdfBuffer = await officeService.powerpointToPdf(pptBuffer);
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.subarray(0, 4).toString()).toBe('%PDF');
  });
});
