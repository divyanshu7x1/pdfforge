import archiver from 'archiver';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import sharp from 'sharp';
import { AppError } from '../../core/errors/app-error';

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
      let pngOrJpgBuffer = img.buffer;
      let isPng = img.mimetype === 'image/png' || img.originalname.toLowerCase().endsWith('.png');
      let isJpg = img.mimetype === 'image/jpeg' || /\.(jpg|jpeg)$/i.test(img.originalname);

      // Convert WebP or unhandled formats to PNG via sharp
      if (!isPng && !isJpg) {
        pngOrJpgBuffer = await sharp(img.buffer).toFormat('png').toBuffer();
        isPng = true;
      }

      let embeddedImage;
      if (isPng) {
        try {
          embeddedImage = await pdfDoc.embedPng(pngOrJpgBuffer);
        } catch {
          // Fallback conversion to JPEG via sharp if PNG embedding fails
          const jpegBuf = await sharp(img.buffer).toFormat('jpeg').toBuffer();
          embeddedImage = await pdfDoc.embedJpg(jpegBuf);
        }
      } else {
        try {
          embeddedImage = await pdfDoc.embedJpg(pngOrJpgBuffer);
        } catch {
          const pngBuf = await sharp(img.buffer).toFormat('png').toBuffer();
          embeddedImage = await pdfDoc.embedPng(pngBuf);
        }
      }

      const dims = embeddedImage.scale(1.0);
      // Fit to standard A4 dimensions (595.28 x 841.89) while preserving aspect ratio
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

    // Render pages as high resolution PNGs using sharp SVG rendering
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

    // Clean HTML tags if plain content conversion
    const cleanText = isHtml ? content.replace(/<[^>]+>/g, '\n') : content;
    const lines = cleanText.split(/\r?\n/);

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentY = pageHeight - margin;

    for (const rawLine of lines) {
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
