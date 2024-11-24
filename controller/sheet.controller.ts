import { Request, Response } from 'express';
import { sheetService } from '../service/sheet-service';
import { z } from 'zod';

async function getSheet(req: Request, res: Response) {
    const parse = z.string().safeParse(req.query.sheetName);
    let sheetName: string;
    
    if (!parse.success) {
        console.log("failed to parse sheetName, using defaultSheet");
        sheetName = 'default';
    } else {
        sheetName = parse.data;
    }

    const sheetData = await sheetService.fetchSheet(sheetName);

    res.json(sheetData);
}

export { getSheet };