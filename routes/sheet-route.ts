import express from "express";
import { getSheet, getWeekStatus, setTaskStatus } from "../controller/sheet.controller";
const router = express.Router();


router.get("/", getSheet);
router.get("/status", getWeekStatus)

router.post("/task", setTaskStatus)
router.delete("/task", setTaskStatus)

export default router;