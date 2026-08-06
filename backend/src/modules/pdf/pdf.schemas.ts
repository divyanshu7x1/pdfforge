import { z } from 'zod';

export const rotateSchema = z.object({
  rotation: z.coerce.number().int().refine((val) => [90, 180, 270, 360, 0].includes(val), {
    message: 'Rotation degrees must be 0, 90, 180, or 270.'
  }),
  pages: z.string().optional() // e.g. "1,2,5-8" or "all"
});

export const splitSchema = z.object({
  pages: z.string().min(1, 'Page selection string is required.') // e.g. "1-3,4,6-10" or "all"
});

export const organizeSchema = z.object({
  pageOrder: z.string().optional(), // comma separated 1-indexed page order e.g. "3,1,2"
  deletePages: z.string().optional() // comma separated page numbers to remove e.g. "2,4"
});

export const protectSchema = z.object({
  password: z.string().min(1, 'Password cannot be empty.')
});

export const unlockSchema = z.object({
  password: z.string().min(1, 'Password is required to unlock document.')
});

export const watermarkSchema = z.object({
  text: z.string().trim().min(1, 'Watermark text is required.'),
  fontSize: z.coerce.number().int().min(8).max(144).default(48),
  opacity: z.coerce.number().min(0.05).max(1).default(0.3),
  rotation: z.coerce.number().int().min(-360).max(360).default(-45),
  position: z.enum(['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right']).default('center')
});

export const pageNumberSchema = z.object({
  position: z.enum(['bottom-center', 'bottom-right', 'bottom-left', 'top-center', 'top-right', 'top-left']).default('bottom-center'),
  format: z.string().trim().min(1).default('Page {page} of {total}'),
  fontSize: z.coerce.number().int().min(8).max(36).default(10),
  margin: z.coerce.number().int().min(10).max(100).default(20)
});

export const compressSchema = z.object({
  quality: z.enum(['low', 'medium', 'high']).default('medium')
});

export const convertHtmlSchema = z.object({
  html: z.string().trim().min(1, 'HTML string is required.'),
  title: z.string().trim().optional()
});
