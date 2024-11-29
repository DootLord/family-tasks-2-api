import express from "express";
import { generateNewSheet, getSheet, getWeekStatus, setTaskStatus } from "../controller/sheet.controller";
const router = express.Router();


router.get("/", getSheet); // Returns the sheet layout
router.get("/status", getWeekStatus) // Returns the task statuses of the sheet

router.post("/task", setTaskStatus) // Sets the task status of a task as complete
router.delete("/task", setTaskStatus) // Sets the task status of a task as incomplete

router.post("/generate", generateNewSheet) // Generates a new sheet
 
export default router;