import { Document, Packer, Paragraph, TextRun } from 'docx';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import * as XLSX from 'xlsx';

import { AppError } from '../../core/errors/app-error';
import { convertService } from './convert.service';

export class OfficeService {
  public async wordToPdf(wordBuffer: Buffer): Promise<Buffer> {
    try {
      const result = await mammoth.convertToHtml({ buffer: wordBuffer });
      const htmlContent = result.value || '<h1>Empty Document</h1>';
      return await convertService.textOrHtmlToPdf(htmlContent, true);
    } catch {
      throw new AppError('Unable to convert Word document to PDF.', 422, 'WORD_CONVERSION_FAILED');
    }
  }

  public async pdfToWord(pdfBuffer: Buffer): Promise<Buffer> {
    let textResult: { text: string };
    try {
      textResult = await pdfParse(pdfBuffer);
    } catch {
      throw new AppError('Unable to parse PDF for Word conversion.', 422, 'PDF_PARSE_FAILED');
    }

    const text = textResult.text || 'No text extracted from PDF.';
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);

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
    } catch {
      throw new AppError('Unable to convert Excel spreadsheet to PDF.', 422, 'EXCEL_CONVERSION_FAILED');
    }
  }

  public async powerpointToPdf(pptBuffer: Buffer): Promise<Buffer> {
    try {
      // Extract raw strings from PPTX zip container
      const pptString = pptBuffer.toString('utf-8');
      const textMatches = pptString.match(/<a:t>([^<]+)<\/a:t>/g) || [];
      const extractedText = textMatches
        .map((m) => m.replace(/<\/?a:t>/g, ''))
        .filter((t) => t.trim().length > 0)
        .join('\n');

      const content = extractedText || 'Presentation Slide Content';
      return await convertService.textOrHtmlToPdf(`<h1>PowerPoint Presentation</h1><p>${content}</p>`, true);
    } catch {
      throw new AppError('Unable to convert PowerPoint presentation to PDF.', 422, 'PPT_CONVERSION_FAILED');
    }
  }
}

export const officeService = new OfficeService();
