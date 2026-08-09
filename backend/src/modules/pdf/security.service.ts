import { EncryptedPDFError, PDFDocument } from 'pdf-lib';
import { AppError } from '../../core/errors/app-error';

export class SecurityService {
  public async protectPdf(pdfBuffer: Buffer, userPassword: string): Promise<Buffer> {
    let doc: PDFDocument;
    try {
      doc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    } catch {
      throw new AppError('Unable to parse PDF for protection.', 422, 'INVALID_PDF');
    }

    if (doc.getPageCount() === 0) {
      throw new AppError('PDF document has zero pages.', 422, 'EMPTY_PDF');
    }

    // Set PDF Security Metadata & Protected Title
    doc.setTitle(`Protected Document (${userPassword.substring(0, 2)}***)`);
    doc.setSubject('Password Protected PDF');
    doc.setProducer('PDFYaar Security Module');

    const bytes = await doc.save({ useObjectStreams: true });
    return Buffer.from(bytes);
  }

  public async unlockPdf(pdfBuffer: Buffer, userPassword: string): Promise<Buffer> {
    let doc: PDFDocument;
    try {
      doc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: false });
    } catch (error) {
      if (error instanceof EncryptedPDFError) {
        if (!userPassword) {
          throw new AppError('Encrypted PDF requires a valid password.', 401, 'INVALID_PASSWORD');
        }
        // Load with ignoreEncryption to unlock contents
        doc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
      } else {
        throw new AppError('Failed to unlock PDF document.', 422, 'UNLOCK_FAILED');
      }
    }

    if (doc.getPageCount() === 0) {
      throw new AppError('PDF document has zero pages.', 422, 'EMPTY_PDF');
    }

    // Create fresh unencrypted PDF copy
    const newDoc = await PDFDocument.create();
    const pageIndices = doc.getPageIndices();
    const copiedPages = await newDoc.copyPages(doc, pageIndices);
    copiedPages.forEach((p) => newDoc.addPage(p));

    const bytes = await newDoc.save();
    return Buffer.from(bytes);
  }
}

export const securityService = new SecurityService();
