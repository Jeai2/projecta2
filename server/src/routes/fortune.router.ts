import { Router } from "express";
import {
  getTodaysFortune,
  getManseFortune,
  getSewoonForDaewoonAPI,
  getWoolwoonForYearAPI,
  getDaewoonRelationshipsAPI,
  getSewoonRelationshipsAPI,
} from "../controllers/fortune.controller";

const router = Router();

router.post("/today", getTodaysFortune);
router.post("/manse", getManseFortune);
router.get("/sewoon", getSewoonForDaewoonAPI);
router.get("/woolwoon", getWoolwoonForYearAPI);
router.get("/daewoon-relationships", getDaewoonRelationshipsAPI);
router.get("/sewoon-relationships", getSewoonRelationshipsAPI);

export default router;
