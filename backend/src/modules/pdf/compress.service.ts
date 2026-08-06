import { PDFDocument } from 'pdf-lib';
import { AppError } from '../../core/errors/app-error';

export class CompressService {
  public async compressPdf(pdfBuffer: Buffer, _qualityLevel: 'low' | 'medium' | 'high' = 'medium'): Promise<Buffer> {
    let pdfDoc: PDFDocument;
    try {
      pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    } catch {
      throw new AppError('Unable to parse PDF for compression.', 422, 'INVALID_PDF');
    }

    const pageCount = pdfDoc.getPageCount();
    if (pageCount === 0) {
      throw new AppError('PDF document has zero pages.', 422, 'EMPTY_PDF');
    }

    // Re-build document into fresh PDF container to purge unused objects, dead revision history, and orphan streams
    const compressedDoc = await PDFDocument.create();
    const copiedPages = await compressedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((p) => compressedDoc.addPage(p));

    // Save with maximum object stream compression enabled
    const compressedBytes = await compressedDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 100
    });

    return Buffer.from(compressedBytes);
  }
}

export const compressService = new CompressService();
