import type { RequestHandler } from 'express';
import { AppError } from '../../core/errors/app-error';
import { compressService } from './compress.service';
import { convertService } from './convert.service';
import { type MergePdfInputFile, mergeService } from './merge.service';
import { officeService } from './office.service';
import { organizeService } from './organize.service';
import { pageNumberService } from './page-number.service';
import {
  compressSchema,
  convertHtmlSchema,
  organizeSchema,
  pageNumberSchema,
  protectSchema,
  rotateSchema,
  splitSchema,
  unlockSchema,
  watermarkSchema
} from './pdf.schemas';
import { rotateService } from './rotate.service';
import { securityService } from './security.service';
import { splitService } from './split.service';
import { getUploadedPdfFiles } from './upload.middleware';
import { watermarkService } from './watermark.service';

export class PdfController {
  public merge: RequestHandler = async (req, res, next) => {
    try {
      const uploadedFiles = getUploadedPdfFiles(req);
      const mergeInput: MergePdfInputFile[] = uploadedFiles.map((file) => ({
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        buffer: file.buffer
      }));

      const mergedPdfBuffer = await mergeService.merge(mergeInput);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="merged.pdf"');
      res.setHeader('Content-Length', mergedPdfBuffer.length.toString());
      res.status(200).send(mergedPdfBuffer);
    } catch (error) {
      next(error);
    }
  };

  public split: RequestHandler = async (req, res, next) => {
    try {
      const uploadedFiles = getUploadedPdfFiles(req);
      const file = uploadedFiles[0];
      if (!file) throw new AppError('No PDF file uploaded for splitting.', 400, 'NO_FILE');

      const parsed = splitSchema.safeParse(req.body);
      const pagesStr = parsed.success ? parsed.data.pages : 'all';

      const result = await splitService.splitPdf(file.buffer, pagesStr);

      res.setHeader('Content-Type', result.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.setHeader('Content-Length', result.buffer.length.toString());
      res.status(200).send(result.buffer);
    } catch (error) {
      next(error);
    }
  };

  public rotate: RequestHandler = async (req, res, next) => {
    try {
      const uploadedFiles = getUploadedPdfFiles(req);
      const file = uploadedFiles[0];
      if (!file) throw new AppError('No PDF file uploaded for rotation.', 400, 'NO_FILE');

      const parsed = rotateSchema.safeParse(req.body);
      const rotation = parsed.success ? parsed.data.rotation : 90;
      const pages = parsed.success ? parsed.data.pages : 'all';

      const buffer = await rotateService.rotatePdf(file.buffer, rotation, pages);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="rotated.pdf"');
      res.setHeader('Content-Length', buffer.length.toString());
      res.status(200).send(buffer);
    } catch (error) {
      next(error);
    }
  };

  public organize: RequestHandler = async (req, res, next) => {
    try {
      const uploadedFiles = getUploadedPdfFiles(req);
      const file = uploadedFiles[0];
      if (!file) throw new AppError('No PDF file uploaded for page organization.', 400, 'NO_FILE');

      const parsed = organizeSchema.safeParse(req.body);
      const pageOrder = parsed.success ? parsed.data.pageOrder : undefined;
      const deletePages = parsed.success ? parsed.data.deletePages : undefined;

      const buffer = await organizeService.organizePdf(file.buffer, pageOrder, deletePages);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="organized.pdf"');
      res.setHeader('Content-Length', buffer.length.toString());
      res.status(200).send(buffer);
    } catch (error) {
      next(error);
    }
  };

  public protect: RequestHandler = async (req, res, next) => {
    try {
      const uploadedFiles = getUploadedPdfFiles(req);
      const file = uploadedFiles[0];
      if (!file) throw new AppError('No PDF file uploaded for password protection.', 400, 'NO_FILE');

      const parsed = protectSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError('A valid password is required to encrypt the PDF.', 400, 'INVALID_PASSWORD_INPUT');
      }

      const buffer = await securityService.protectPdf(file.buffer, parsed.data.password);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="protected.pdf"');
      res.setHeader('Content-Length', buffer.length.toString());
      res.status(200).send(buffer);
    } catch (error) {
      next(error);
    }
  };

  public unlock: RequestHandler = async (req, res, next) => {
    try {
      const uploadedFiles = getUploadedPdfFiles(req);
      const file = uploadedFiles[0];
      if (!file) throw new AppError('No PDF file uploaded for unlocking.', 400, 'NO_FILE');

      const parsed = unlockSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError('Password is required to unlock the PDF.', 400, 'INVALID_PASSWORD_INPUT');
      }

      const buffer = await securityService.unlockPdf(file.buffer, parsed.data.password);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="unlocked.pdf"');
      res.setHeader('Content-Length', buffer.length.toString());
      res.status(200).send(buffer);
    } catch (error) {
      next(error);
    }
  };

  public watermark: RequestHandler = async (req, res, next) => {
    try {
      const uploadedFiles = getUploadedPdfFiles(req);
      const file = uploadedFiles[0];
      if (!file) throw new AppError('No PDF file uploaded for watermarking.', 400, 'NO_FILE');

      const parsed = watermarkSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError('Watermark text is required.', 400, 'INVALID_WATERMARK_INPUT');
      }

      const buffer = await watermarkService.addWatermark(file.buffer, parsed.data);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="watermarked.pdf"');
      res.setHeader('Content-Length', buffer.length.toString());
      res.status(200).send(buffer);
    } catch (error) {
      next(error);
    }
  };

  public pageNumbers: RequestHandler = async (req, res, next) => {
    try {
      const uploadedFiles = getUploadedPdfFiles(req);
      const file = uploadedFiles[0];
      if (!file) throw new AppError('No PDF file uploaded for page numbering.', 400, 'NO_FILE');

      const parsed = pageNumberSchema.safeParse(req.body);
      const options = parsed.success ? parsed.data : {};

      const buffer = await pageNumberService.addPageNumbers(file.buffer, options);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="numbered.pdf"');
      res.setHeader('Content-Length', buffer.length.toString());
      res.status(200).send(buffer);
    } catch (error) {
      next(error);
    }
  };

  public imagesToPdf: RequestHandler = async (req, res, next) => {
    try {
      const uploadedFiles = getUploadedPdfFiles(req);
      if (uploadedFiles.length === 0) {
        throw new AppError('At least one image file is required for PDF conversion.', 400, 'NO_IMAGES');
      }

      const imageInputs = uploadedFiles.map((f) => ({
        originalname: f.originalname,
        mimetype: f.mimetype,
        buffer: f.buffer
      }));

      const pdfBuffer = await convertService.imagesToPdf(imageInputs);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="images-converted.pdf"');
      res.setHeader('Content-Length', pdfBuffer.length.toString());
      res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };

  public pdfToImages: RequestHandler = async (req, res, next) => {
    try {
      const uploadedFiles = getUploadedPdfFiles(req);
      const file = uploadedFiles[0];
      if (!file) throw new AppError('No PDF file uploaded for image conversion.', 400, 'NO_FILE');

      const result = await convertService.pdfToImages(file.buffer);

      res.setHeader('Content-Type', result.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.setHeader('Content-Length', result.buffer.length.toString());
      res.status(200).send(result.buffer);
    } catch (error) {
      next(error);
    }
  };

  public convertHtmlText: RequestHandler = async (req, res, next) => {
    try {
      const parsed = convertHtmlSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError('Valid HTML or text content is required.', 400, 'INVALID_HTML_INPUT');
      }

      const pdfBuffer = await convertService.textOrHtmlToPdf(parsed.data.html, true);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
      res.setHeader('Content-Length', pdfBuffer.length.toString());
      res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };

  public compress: RequestHandler = async (req, res, next) => {
    try {
      const uploadedFiles = getUploadedPdfFiles(req);
      const file = uploadedFiles[0];
      if (!file) throw new AppError('No PDF file uploaded for compression.', 400, 'NO_FILE');

      const parsed = compressSchema.safeParse(req.body);
      const quality = parsed.success ? parsed.data.quality : 'medium';

      const buffer = await compressService.compressPdf(file.buffer, quality);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="compressed.pdf"');
      res.setHeader('Content-Length', buffer.length.toString());
      res.status(200).send(buffer);
    } catch (error) {
      next(error);
    }
  };

  public wordToPdf: RequestHandler = async (req, res, next) => {
    try {
      const uploadedFiles = getUploadedPdfFiles(req);
      const file = uploadedFiles[0];
      if (!file) throw new AppError('No Word file uploaded for conversion.', 400, 'NO_FILE');

      const pdfBuffer = await officeService.wordToPdf(file.buffer);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="word-converted.pdf"');
      res.setHeader('Content-Length', pdfBuffer.length.toString());
      res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };

  public pdfToWord: RequestHandler = async (req, res, next) => {
    try {
      const uploadedFiles = getUploadedPdfFiles(req);
      const file = uploadedFiles[0];
      if (!file) throw new AppError('No PDF file uploaded for Word conversion.', 400, 'NO_FILE');

      const docxBuffer = await officeService.pdfToWord(file.buffer);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="converted.docx"');
      res.setHeader('Content-Length', docxBuffer.length.toString());
      res.status(200).send(docxBuffer);
    } catch (error) {
      next(error);
    }
  };

  public excelToPdf: RequestHandler = async (req, res, next) => {
    try {
      const uploadedFiles = getUploadedPdfFiles(req);
      const file = uploadedFiles[0];
      if (!file) throw new AppError('No Excel file uploaded for conversion.', 400, 'NO_FILE');

      const pdfBuffer = await officeService.excelToPdf(file.buffer);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="excel-converted.pdf"');
      res.setHeader('Content-Length', pdfBuffer.length.toString());
      res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };

  public powerpointToPdf: RequestHandler = async (req, res, next) => {
    try {
      const uploadedFiles = getUploadedPdfFiles(req);
      const file = uploadedFiles[0];
      if (!file) throw new AppError('No PowerPoint file uploaded for conversion.', 400, 'NO_FILE');

      const pdfBuffer = await officeService.powerpointToPdf(file.buffer);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="presentation-converted.pdf"');
      res.setHeader('Content-Length', pdfBuffer.length.toString());
      res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };
}

export const pdfController = new PdfController();
