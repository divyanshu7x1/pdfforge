import archiver from 'archiver';
import { PDFDocument } from 'pdf-lib';
import { Readable } from 'node:stream';

import { AppError } from '../../core/errors/app-error';

export interface SplitResult {
  filename: string;
  mimeType: 'application/pdf' | 'application/zip';
  buffer: Buffer;
}

export function parsePageRange(rangeStr: string, totalPages: number): number[] {
  const selectedPages = new Set<number>();
  const parts = rangeStr.split(',').map((p) => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.toLowerCase() === 'all') {
      for (let i = 0; i < totalPages; i++) selectedPages.add(i);
      break;
    }

    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => s.trim());
      const start = Math.max(1, parseInt(startStr || '1', 10));
      const end = Math.min(totalPages, parseInt(endStr || totalPages.toString(), 10));

      for (let page = start; page <= end; page++) {
        selectedPages.add(page - 1);
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        selectedPages.add(pageNum - 1);
      }
    }
  }

  return Array.from(selectedPages).sort((a, b) => a - b);
}

export class SplitService {
  public async splitPdf(pdfBuffer: Buffer, pagesStr: string): Promise<SplitResult> {
    let doc: PDFDocument;
    try {
      doc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    } catch {
      throw new AppError('Unable to parse source PDF for splitting.', 422, 'INVALID_PDF');
    }

    const totalPages = doc.getPageCount();
    if (totalPages === 0) {
      throw new AppError('PDF contains no pages to split.', 422, 'EMPTY_PDF');
    }

    const targetIndices = parsePageRange(pagesStr, totalPages);
    if (targetIndices.length === 0) {
      throw new AppError('No valid pages selected for splitting.', 400, 'INVALID_PAGE_SELECTION');
    }

    // Single extraction range -> single PDF output
    if (targetIndices.length === 1 || pagesStr.includes('-')) {
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(doc, targetIndices);
      copiedPages.forEach((p) => newDoc.addPage(p));
      const resultBytes = await newDoc.save();

      return {
        filename: 'split-extracted.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from(resultBytes)
      };
    }

    // Multiple individual page splits -> ZIP package
    const archive = archiver('zip', { zlib: { level: 9 } });
    const chunks: Buffer[] = [];

    const zipStreamPromise = new Promise<Buffer>((resolve, reject) => {
      archive.on('data', (chunk: Buffer) => chunks.push(chunk));
      archive.on('end', () => resolve(Buffer.concat(chunks)));
      archive.on('error', (err: Error) => reject(err));
    });

    for (const pageIdx of targetIndices) {
      const singleDoc = await PDFDocument.create();
      const [copiedPage] = await singleDoc.copyPages(doc, [pageIdx]);
      if (copiedPage) singleDoc.addPage(copiedPage);

      const pdfBytes = await singleDoc.save();
      archive.append(Buffer.from(pdfBytes), { name: `page-${pageIdx + 1}.pdf` });
    }

    await archive.finalize();
    const zipBuffer = await zipStreamPromise;

    return {
      filename: 'split-pages.zip',
      mimeType: 'application/zip',
      buffer: zipBuffer
    };
  }
}

export const splitService = new SplitService();
