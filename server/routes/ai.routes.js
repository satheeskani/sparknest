import express from "express";
import { aiSearch, aiRecommend, aiChat } from "../controllers/ai.controller.js";

const router = express.Router();
router.post("/search", aiSearch);
router.post("/recommend", aiRecommend);
router.post("/chat", aiChat);

export default router;