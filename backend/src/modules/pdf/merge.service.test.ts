import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { MergeService } from './merge.service';
import {
  CorruptedPdfError,
  EmptyPdfUploadError,
  InvalidPdfError
} from './pdf.errors';

async function createMinimalPdfBuffer(pageCount = 1): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    doc.addPage([500, 500]);
  }
  const bytes = await doc.save();
  return Buffer.from(bytes);
}

const mockLogger = {
  info: () => {},
  warn: () => {},
  error: () => {}
};

describe('MergeService', () => {
  const service = new MergeService(mockLogger);

  it('should throw EmptyPdfUploadError when no files are provided', async () => {
    await expect(service.merge([])).rejects.toThrow(EmptyPdfUploadError);
  });

  it('should throw EmptyPdfUploadError when a file has zero bytes', async () => {
    const input = [
      {
        originalName: 'empty.pdf',
        mimeType: 'application/pdf',
        size: 0,
        buffer: Buffer.alloc(0)
      }
    ];

    await expect(service.merge(input)).rejects.toThrow(EmptyPdfUploadError);
  });

  it('should throw InvalidPdfError when PDF header signature is missing', async () => {
    const input = [
      {
        originalName: 'fake.pdf',
        mimeType: 'application/pdf',
        size: 12,
        buffer: Buffer.from('NOT_A_PDF_FILE')
      }
    ];

    await expect(service.merge(input)).rejects.toThrow(InvalidPdfError);
  });

  it('should throw CorruptedPdfError when file has PDF signature but invalid structure', async () => {
    const input = [
      {
        originalName: 'corrupt.pdf',
        mimeType: 'application/pdf',
        size: 20,
        buffer: Buffer.from('%PDF-1.7 corrupt data')
      }
    ];

    await expect(service.merge(input)).rejects.toThrow(CorruptedPdfError);
  });

  it('should successfully merge two valid PDFs into one document', async () => {
    const pdf1 = await createMinimalPdfBuffer(2);
    const pdf2 = await createMinimalPdfBuffer(3);

    const input = [
      {
        originalName: 'file1.pdf',
        mimeType: 'application/pdf',
        size: pdf1.length,
        buffer: pdf1
      },
      {
        originalName: 'file2.pdf',
        mimeType: 'application/pdf',
        size: pdf2.length,
        buffer: pdf2
      }
    ];

    const resultBuffer = await service.merge(input);
    expect(resultBuffer).toBeInstanceOf(Buffer);
    expect(resultBuffer.length).toBeGreaterThan(0);

    const mergedDoc = await PDFDocument.load(resultBuffer);
    expect(mergedDoc.getPageCount()).toBe(5);
  });
});
