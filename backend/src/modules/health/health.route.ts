import { Router } from 'express';

import { healthController } from './health.controller';

const healthRouter: Router = Router();

healthRouter.get('/', healthController.getStatus);

export { healthRouter };
