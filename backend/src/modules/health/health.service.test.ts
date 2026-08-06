import { describe, expect, it } from 'vitest';
import { healthService } from './health.service';

describe('HealthService', () => {
  it('should return valid health status object', () => {
    const status = healthService.getStatus();
    expect(status.status).toBe('ok');
    expect(status.service).toBeDefined();
    expect(status.environment).toBeDefined();
    expect(status.version).toBeDefined();
    expect(typeof status.uptime).toBe('number');
    expect(new Date(status.timestamp).valueOf()).not.toBeNaN();
  });
});
