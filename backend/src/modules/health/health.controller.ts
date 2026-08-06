import type { RequestHandler } from 'express';

import { healthService } from './health.service';

class HealthController {
  public getStatus: RequestHandler = (_req, res) => {
    res.status(200).json({
      success: true,
      data: healthService.getStatus()
    });
  };
}

export const healthController = new HealthController();
