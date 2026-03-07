import { Router } from "express";
import {
  getTodayFortuneAPI,
  getManseFortune,
  getSewoonForDaewoonAPI,
  getWoolwoonForYearAPI,
  getDaewoonRelationshipsAPI,
  getSewoonRelationshipsAPI,
  getIljuFortune,
  getCareerAnalysis,
  getOhaengChart,
  postCareerChat,
  getMookAFortuneAPI,
} from "../controllers/fortune.controller";

const router = Router();

router.post("/today", getTodayFortuneAPI);
router.post("/manse", getManseFortune);
router.post("/ilju", getIljuFortune);
router.post("/career", getCareerAnalysis);
router.post("/career-chat", postCareerChat);
router.post("/ohaeng-chart", getOhaengChart);
router.get("/sewoon", getSewoonForDaewoonAPI);
router.get("/woolwoon", getWoolwoonForYearAPI);
router.get("/daewoon-relationships", getDaewoonRelationshipsAPI);
router.get("/sewoon-relationships", getSewoonRelationshipsAPI);
router.post("/mook-a", getMookAFortuneAPI);

export default router;
