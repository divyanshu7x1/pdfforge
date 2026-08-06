import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { AppError } from '../../core/errors/app-error';

export interface PageNumberOptions {
  position?: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';
  format?: string; // e.g. "Page {page} of {total}"
  fontSize?: number;
  margin?: number;
}

export class PageNumberService {
  public async addPageNumbers(pdfBuffer: Buffer, options: PageNumberOptions = {}): Promise<Buffer> {
    let doc: PDFDocument;
    try {
      doc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    } catch {
      throw new AppError('Unable to parse PDF for page numbering.', 422, 'INVALID_PDF');
    }

    const pages = doc.getPages();
    const totalPages = pages.length;
    if (totalPages === 0) {
      throw new AppError('PDF contains no pages.', 422, 'EMPTY_PDF');
    }

    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontSize = options.fontSize ?? 10;
    const margin = options.margin ?? 20;
    const formatStr = options.format ?? 'Page {page} of {total}';
    const position = options.position ?? 'bottom-center';

    for (let i = 0; i < totalPages; i++) {
      const page = pages[i];
      if (!page) continue;
      
      const { width, height } = page.getSize();
      const pageNum = i + 1;
      const label = formatStr.replace('{page}', pageNum.toString()).replace('{total}', totalPages.toString());

      const labelWidth = font.widthOfTextAtSize(label, fontSize);
      let x = (width - labelWidth) / 2;
      let y = margin;

      if (position === 'bottom-left') x = margin;
      else if (position === 'bottom-right') x = width - labelWidth - margin;
      else if (position === 'top-center') y = height - margin - fontSize;
      else if (position === 'top-left') {
        x = margin;
        y = height - margin - fontSize;
      } else if (position === 'top-right') {
        x = width - labelWidth - margin;
        y = height - margin - fontSize;
      }

      page.drawText(label, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.2, 0.2, 0.25)
      });
    }

    const bytes = await doc.save();
    return Buffer.from(bytes);
  }
}

export const pageNumberService = new PageNumberService();
