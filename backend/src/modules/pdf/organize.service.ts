import { PDFDocument } from 'pdf-lib';
import { AppError } from '../../core/errors/app-error';

export class OrganizeService {
  public async organizePdf(
    pdfBuffer: Buffer,
    pageOrderStr?: string,
    deletePagesStr?: string
  ): Promise<Buffer> {
    let sourceDoc: PDFDocument;
    try {
      sourceDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    } catch {
      throw new AppError('Unable to parse PDF for page organization.', 422, 'INVALID_PDF');
    }

    const totalPages = sourceDoc.getPageCount();
    if (totalPages === 0) {
      throw new AppError('PDF contains no pages.', 422, 'EMPTY_PDF');
    }

    // Determine pages to delete
    const deleteSet = new Set<number>();
    if (deletePagesStr) {
      deletePagesStr.split(',').forEach((p) => {
        const num = parseInt(p.trim(), 10);
        if (!isNaN(num) && num >= 1 && num <= totalPages) {
          deleteSet.add(num - 1);
        }
      });
    }

    // Determine final order of page 0-indexed numbers
    let finalOrder: number[] = [];
    if (pageOrderStr) {
      pageOrderStr.split(',').forEach((p) => {
        const num = parseInt(p.trim(), 10);
        if (!isNaN(num) && num >= 1 && num <= totalPages) {
          const idx = num - 1;
          if (!deleteSet.has(idx)) {
            finalOrder.push(idx);
          }
        }
      });
    } else {
      for (let i = 0; i < totalPages; i++) {
        if (!deleteSet.has(i)) {
          finalOrder.push(i);
        }
      }
    }

    if (finalOrder.length === 0) {
      throw new AppError('Organizing pages resulted in an empty PDF document.', 400, 'NO_PAGES_REMAINING');
    }

    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(sourceDoc, finalOrder);
    copiedPages.forEach((p) => newDoc.addPage(p));

    const bytes = await newDoc.save();
    return Buffer.from(bytes);
  }
}

export const organizeService = new OrganizeService();
