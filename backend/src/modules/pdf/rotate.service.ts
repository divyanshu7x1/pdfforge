import { degrees, PDFDocument } from 'pdf-lib';
import { AppError } from '../../core/errors/app-error';
import { parsePageRange } from './split.service';

export class RotateService {
  public async rotatePdf(
    pdfBuffer: Buffer,
    rotationAngle: number,
    pagesStr = 'all'
  ): Promise<Buffer> {
    let doc: PDFDocument;
    try {
      doc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    } catch {
      throw new AppError('Unable to parse PDF for rotation.', 422, 'INVALID_PDF');
    }

    const totalPages = doc.getPageCount();
    if (totalPages === 0) {
      throw new AppError('PDF document has zero pages.', 422, 'EMPTY_PDF');
    }

    const targetIndices = parsePageRange(pagesStr, totalPages);
    const pagesToRotate = targetIndices.length > 0 ? targetIndices : Array.from({ length: totalPages }, (_, i) => i);

    for (const idx of pagesToRotate) {
      const page = doc.getPage(idx);
      const currentRotation = page.getRotation().angle;
      const newRotation = (currentRotation + rotationAngle) % 360;
      page.setRotation(degrees(newRotation));
    }

    const bytes = await doc.save();
    return Buffer.from(bytes);
  }
}

export const rotateService = new RotateService();
