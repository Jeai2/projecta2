import { Router } from 'express';
import { getTodaysFortune } from '../controllers/fortune.controller'; // 로직을 담고 있는 컨트롤러를 import

const router = Router();

// [핵심]
// '/today' 경로로 POST 요청이 오면,
// 실제 로직 처리는 'getTodaysFortune' 컨트롤러에게 넘긴다.
// 이제 라우터는 어떤 로직을 처리하는지 알 필요가 없다. 오직 연결만 담당한다.
router.post('/today', getTodaysFortune);

export default router;
