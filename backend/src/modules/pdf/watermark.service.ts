import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { AppError } from '../../core/errors/app-error';

export interface WatermarkOptions {
  text: string;
  fontSize?: number;
  opacity?: number;
  rotation?: number;
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export class WatermarkService {
  public async addWatermark(pdfBuffer: Buffer, options: WatermarkOptions): Promise<Buffer> {
    let doc: PDFDocument;
    try {
      doc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    } catch {
      throw new AppError('Unable to parse PDF for watermarking.', 422, 'INVALID_PDF');
    }

    const pages = doc.getPages();
    if (pages.length === 0) {
      throw new AppError('PDF contains no pages.', 422, 'EMPTY_PDF');
    }

    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = options.fontSize ?? 48;
    const opacity = options.opacity ?? 0.3;
    const rotation = options.rotation ?? -45;
    const text = options.text;

    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    for (const page of pages) {
      const { width, height } = page.getSize();
      let x = (width - textWidth) / 2;
      let y = (height - textHeight) / 2;

      if (options.position === 'top-left') {
        x = 40;
        y = height - textHeight - 40;
      } else if (options.position === 'top-right') {
        x = width - textWidth - 40;
        y = height - textHeight - 40;
      } else if (options.position === 'bottom-left') {
        x = 40;
        y = 40;
      } else if (options.position === 'bottom-right') {
        x = width - textWidth - 40;
        y = 40;
      }

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.3, 0.3, 0.35),
        opacity,
        rotate: degrees(rotation)
      });
    }

    const bytes = await doc.save();
    return Buffer.from(bytes);
  }
}

export const watermarkService = new WatermarkService();
