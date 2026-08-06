import packageJson from '../../../package.json';

import { env } from '../../config/env';

export interface HealthStatus {
  status: 'ok';
  service: string;
  environment: string;
  timestamp: string;
  uptime: number;
  version: string;
}

class HealthService {
  public getStatus(): HealthStatus {
    return {
      status: 'ok',
      service: env.APP_NAME,
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: Number(process.uptime().toFixed(2)),
      version: packageJson.version
    };
  }
}

export const healthService = new HealthService();
