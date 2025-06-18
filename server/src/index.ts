import express from 'express';
import cors from 'cors';
import fortuneRouter from './routes/fortune.router';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/fortune', fortuneRouter);

app.listen(port, () => {
  console.log(`[Server] jjhome 백엔드 서버가 http://localhost:${port} 에서 실행 중입니다.`);
});