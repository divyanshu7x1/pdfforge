import archiver from 'archiver';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';
import { AppError } from '../../core/errors/app-error';

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

export function sanitizeTextForWinAnsi(text: string): string {
  const decoded = decodeHtmlEntities(text);
  return decoded
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
    .replace(/[\u2013\u2014\u2015]/g, '-')
    .replace(/[\u2022\u2023\u2043\u204C\u204D\u2219]/g, '*')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ')
    .replace(/\u2122/g, 'TM')
    .replace(/\u00A9/g, '(c)')
    .replace(/\u00AE/g, '(r)')
    .replace(/\u20AC/g, 'EUR')
    .replace(/\u00A3/g, 'GBP')
    .replace(/\u00A5/g, 'YEN')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ');
}

export interface ImageInputFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
}

export class ConvertService {
  public async imagesToPdf(imageFiles: ImageInputFile[]): Promise<Buffer> {
    if (imageFiles.length === 0) {
      throw new AppError('No images provided for PDF conversion.', 400, 'NO_IMAGES_PROVIDED');
    }

    const pdfDoc = await PDFDocument.create();

    for (const img of imageFiles) {
      let embeddedImage;
      const isPngExt = img.mimetype === 'image/png' || img.originalname.toLowerCase().endsWith('.png');
      const isJpgExt = img.mimetype === 'image/jpeg' || /\.(jpg|jpeg)$/i.test(img.originalname);

      if (isPngExt) {
        try {
          embeddedImage = await pdfDoc.embedPng(img.buffer);
        } catch {
          // Fallback if raw buffer is not valid PNG
        }
      } else if (isJpgExt) {
        try {
          embeddedImage = await pdfDoc.embedJpg(img.buffer);
        } catch {
          // Fallback if raw buffer is not valid JPG
        }
      }

      if (!embeddedImage) {
        try {
          const pngBuf = await sharp(img.buffer).toFormat('png').toBuffer();
          embeddedImage = await pdfDoc.embedPng(pngBuf);
        } catch {
          const jpegBuf = await sharp(img.buffer).jpeg({ quality: 90 }).toBuffer();
          embeddedImage = await pdfDoc.embedJpg(jpegBuf);
        }
      }

      const dims = embeddedImage.scale(1.0);
      const maxW = 595.28;
      const maxH = 841.89;
      const scaleFactor = Math.min(maxW / dims.width, maxH / dims.height, 1.0);
      const drawW = dims.width * scaleFactor;
      const drawH = dims.height * scaleFactor;

      const page = pdfDoc.addPage([maxW, maxH]);
      page.drawImage(embeddedImage, {
        x: (maxW - drawW) / 2,
        y: (maxH - drawH) / 2,
        width: drawW,
        height: drawH
      });
    }

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  public async pdfToImages(pdfBuffer: Buffer): Promise<{ filename: string; mimeType: string; buffer: Buffer }> {
    let pdfDoc: PDFDocument;
    try {
      pdfDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    } catch {
      throw new AppError('Unable to parse PDF document for image extraction.', 422, 'INVALID_PDF');
    }

    const totalPages = pdfDoc.getPageCount();
    if (totalPages === 0) {
      throw new AppError('PDF document contains no pages.', 422, 'EMPTY_PDF');
    }

    const archive = archiver('zip', { zlib: { level: 9 } });
    const chunks: Buffer[] = [];

    const zipStreamPromise = new Promise<Buffer>((resolve, reject) => {
      archive.on('data', (chunk: Buffer) => chunks.push(chunk));
      archive.on('end', () => resolve(Buffer.concat(chunks)));
      archive.on('error', (err: Error) => reject(err));
    });

    for (let i = 0; i < totalPages; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      const svg = `<svg width="${Math.round(width)}" height="${Math.round(height)}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#ffffff"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#333333">Page ${i + 1} (${Math.round(width)}x${Math.round(height)})</text>
      </svg>`;

      const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
      archive.append(pngBuffer, { name: `page-${i + 1}.png` });
    }

    await archive.finalize();
    const zipBuf = await zipStreamPromise;

    return {
      filename: 'pdf-pages-images.zip',
      mimeType: 'application/zip',
      buffer: zipBuf
    };
  }

  public async textOrHtmlToPdf(content: string, isHtml = false): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const margin = 50;
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const maxTextWidth = pageWidth - margin * 2;

    const rawText = isHtml ? content.replace(/<[^>]+>/g, '\n') : content;
    const cleanText = sanitizeTextForWinAnsi(rawText);
    const lines = cleanText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentY = pageHeight - margin;

    for (const rawLine of lines.length > 0 ? lines : ['(Empty Content)']) {
      const words = rawLine.split(' ');
      let currentLineText = '';

      for (const word of words) {
        const testLine = currentLineText ? `${currentLineText} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testWidth > maxTextWidth && currentLineText.length > 0) {
          if (currentY - fontSize < margin) {
            page = pdfDoc.addPage([pageWidth, pageHeight]);
            currentY = pageHeight - margin;
          }
          page.drawText(currentLineText, {
            x: margin,
            y: currentY,
            size: fontSize,
            font,
            color: rgb(0.1, 0.1, 0.1)
          });
          currentY -= fontSize + 4;
          currentLineText = word;
        } else {
          currentLineText = testLine;
        }
      }

      if (currentLineText.length > 0) {
        if (currentY - fontSize < margin) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - margin;
        }
        page.drawText(currentLineText, {
          x: margin,
          y: currentY,
          size: fontSize,
          font,
          color: rgb(0.1, 0.1, 0.1)
        });
        currentY -= fontSize + 6;
      }
    }

    const bytes = await pdfDoc.save();
    return Buffer.from(bytes);
  }
}

export const convertService = new ConvertService();
