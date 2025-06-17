import express from 'express';
import cors from 'cors';
import fortuneRouter from './routes/fortune.router'; // '운세 전문 라우터'를 import

const app = express();
const port = 3001;

// 기본 미들웨어 설정
app.use(cors());
app.use(express.json());

// '/api/fortune'이라는 주소로 오는 모든 요청은
// '운세 전문 라우터(fortuneRouter)'에서 처리하도록 책임과 권한을 통째로 위임한다.
app.use('/api/fortune', fortuneRouter);

// 서버 실행
app.listen(port, () => {
  console.log(`[Server] jjhome 백엔드 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
