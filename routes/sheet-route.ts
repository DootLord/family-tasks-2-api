import express from "express";
import { getSheet } from "../controller/sheet.controller";
const router = express.Router();


router.get("/", getSheet);

export default router;