import { Router } from 'express';
import { apiToolRateLimiter } from '../../core/middleware/rate-limiter.middleware';
import { pdfController } from './pdf.controller';
import {
  uploadImageFiles,
  uploadOfficeFiles,
  uploadPdfFiles,
  validateMinimumPdfFiles
} from './upload.middleware';

const pdfRouter: Router = Router();

// Apply tool rate limiter to all PDF endpoints
pdfRouter.use(apiToolRateLimiter);

pdfRouter.post('/merge', uploadPdfFiles(), validateMinimumPdfFiles(2), pdfController.merge);
pdfRouter.post('/merge-pdf', uploadPdfFiles(), validateMinimumPdfFiles(2), pdfController.merge);
pdfRouter.post('/split', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.split);
pdfRouter.post('/split-pdf', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.split);
pdfRouter.post('/rotate', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.rotate);
pdfRouter.post('/rotate-pdf', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.rotate);
pdfRouter.post('/organize', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.organize);
pdfRouter.post('/organize-pdf', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.organize);
pdfRouter.post('/protect', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.protect);
pdfRouter.post('/protect-pdf', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.protect);
pdfRouter.post('/unlock', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.unlock);
pdfRouter.post('/unlock-pdf', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.unlock);
pdfRouter.post('/watermark', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.watermark);
pdfRouter.post('/watermark-pdf', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.watermark);
pdfRouter.post('/page-numbers', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.pageNumbers);
pdfRouter.post('/images-to-pdf', uploadImageFiles(), validateMinimumPdfFiles(1), pdfController.imagesToPdf);
pdfRouter.post('/pdf-to-images', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.pdfToImages);
pdfRouter.post('/convert-html', pdfController.convertHtmlText);
pdfRouter.post('/compress', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.compress);
pdfRouter.post('/compress-pdf', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.compress);
pdfRouter.post('/word-to-pdf', uploadOfficeFiles(), validateMinimumPdfFiles(1), pdfController.wordToPdf);
pdfRouter.post('/pdf-to-word', uploadPdfFiles(), validateMinimumPdfFiles(1), pdfController.pdfToWord);
pdfRouter.post('/excel-to-pdf', uploadOfficeFiles(), validateMinimumPdfFiles(1), pdfController.excelToPdf);
pdfRouter.post('/powerpoint-to-pdf', uploadOfficeFiles(), validateMinimumPdfFiles(1), pdfController.powerpointToPdf);

export { pdfRouter };
