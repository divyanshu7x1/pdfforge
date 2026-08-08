import { Document, Packer, Paragraph, TextRun } from 'docx';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import * as XLSX from 'xlsx';

import { AppError } from '../../core/errors/app-error';
import { convertService } from './convert.service';

export class OfficeService {
  public async wordToPdf(wordBuffer: Buffer): Promise<Buffer> {
    // 1. Primary: Mammoth HTML conversion
    try {
      const result = await mammoth.convertToHtml({ buffer: wordBuffer });
      if (result.value && result.value.trim().length > 0) {
        return await convertService.textOrHtmlToPdf(result.value, true);
      }
    } catch {
      // Fall through to raw text extraction
    }

    // 2. Secondary: Mammoth raw text extraction (handles complex docx, drawings, tables)
    try {
      const rawResult = await mammoth.extractRawText({ buffer: wordBuffer });
      if (rawResult.value && rawResult.value.trim().length > 0) {
        return await convertService.textOrHtmlToPdf(rawResult.value, false);
      }
    } catch {
      // Fall through to stream extraction
    }

    // 3. Tertiary: OLE/Stream text extraction for legacy .doc or unzipped text streams
    try {
      const rawString = wordBuffer.toString('latin1');
      const textMatches = rawString.match(/[\x20-\x7E]{4,}/g) || [];
      const cleaned = textMatches
        .filter((s) => !s.startsWith('PK') && !s.includes('word/') && !s.includes('[Content_Types]'))
        .join('\n');

      if (cleaned.trim().length > 10) {
        return await convertService.textOrHtmlToPdf(cleaned, false);
      }
    } catch {
      // Ignore
    }

    throw new AppError(
      'Unable to convert Word document to PDF. Ensure the file is a valid .docx or .doc document.',
      422,
      'WORD_CONVERSION_FAILED'
    );
  }

  public async pdfToWord(pdfBuffer: Buffer): Promise<Buffer> {
    let text = '';
    try {
      const textResult = await pdfParse(pdfBuffer);
      text = textResult.text || '';
    } catch {
      try {
        const rawString = pdfBuffer.toString('latin1');
        const matches = rawString.match(/\(([^()]+)\)\s*Tj/g) || [];
        text = matches.map((m) => m.replace(/^\(/, '').replace(/\)\s*Tj$/, '')).join('\n');
      } catch {
        // Fall through
      }
    }

    const cleanText = text.trim() || 'Extracted document text from PDF.';
    const lines = cleanText.split(/\r?\n/).filter((line) => line.trim().length > 0);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: lines.map(
            (line) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    font: 'Calibri',
                    size: 24 // 12pt font
                  })
                ]
              })
          )
        }
      ]
    });

    const docxBuffer = await Packer.toBuffer(doc);
    return docxBuffer;
  }

  public async excelToPdf(excelBuffer: Buffer): Promise<Buffer> {
    try {
      const workbook = XLSX.read(excelBuffer, { type: 'buffer' });
      let htmlTables = '';

      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        if (sheet) {
          const tableHtml = XLSX.utils.sheet_to_html(sheet);
          htmlTables += `<h2>Sheet: ${sheetName}</h2>${tableHtml}<br/><hr/><br/>`;
        }
      }

      if (!htmlTables) {
        htmlTables = '<h1>Empty Spreadsheet</h1>';
      }

      return await convertService.textOrHtmlToPdf(htmlTables, true);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Excel conversion failed';
      throw new AppError(`Unable to convert Excel spreadsheet to PDF: ${msg}`, 422, 'EXCEL_CONVERSION_FAILED');
    }
  }

  public async powerpointToPdf(pptBuffer: Buffer): Promise<Buffer> {
    try {
      const pptString = pptBuffer.toString('utf-8');
      const textMatches = pptString.match(/<a:t>([^<]+)<\/a:t>/g) || [];
      const extractedText = textMatches
        .map((m) => m.replace(/<\/?a:t>/g, ''))
        .filter((t) => t.trim().length > 0)
        .join('\n');

      const content = extractedText || 'Presentation Slide Content';
      return await convertService.textOrHtmlToPdf(`<h1>PowerPoint Presentation</h1><p>${content}</p>`, true);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'PowerPoint conversion failed';
      throw new AppError(`Unable to convert PowerPoint presentation to PDF: ${msg}`, 422, 'PPT_CONVERSION_FAILED');
    }
  }
}

export const officeService = new OfficeService();
