import { Router } from 'express';
import { getTodaysFortune } from '../controllers/fortune.controller';

const router = Router();

router.post('/today', getTodaysFortune);

export default router;