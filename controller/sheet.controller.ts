import { Request, Response } from 'express';
import { sheetService } from '../service/sheet-service';
import { z } from 'zod';
import { TaskStatus } from '../schema/sheet-schema';

export async function getSheet(req: Request, res: Response) {
    const parse = z.string().safeParse(req.query.sheetName);
    let sheetName: string;

    if (!parse.success) {
        sheetName = 'default';
    } else {
        sheetName = parse.data;
    }

    const sheetData = await sheetService.fetchSheet(sheetName);

    res.json(sheetData);
}

export async function getWeekStatus(req: Request, res: Response) {
    const weekStatus = await sheetService.fetchWeekStatus();
    res.json(weekStatus);
}

export async function setTaskStatus(req: Request, res: Response) {
    const { day, taskIndex } = req.body;
    const status = req.method === 'POST' ? TaskStatus.COMPLETE : TaskStatus.INCOMPLETE;
    const sheetData = await sheetService.setTaskStatus(day, taskIndex, status);

    res.json(sheetData);
}