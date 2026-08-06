import { Router } from 'express';

import { env } from '../config/env';
import { pdfRouter } from '../modules/pdf/pdf.routes';

const apiRouter: Router = Router();

apiRouter.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: env.APP_NAME,
      message: 'PDFForge API foundation is ready.'
    }
  });
});

apiRouter.use('/pdf', pdfRouter);

export { apiRouter };
