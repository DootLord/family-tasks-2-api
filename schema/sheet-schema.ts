import { z } from "zod";

interface ISheetDataDB {
    id: string;
    name: string;
    jobs: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
}

interface ISheetData { //? Would be good to just extend ISheetDataDB
    id: string;
    name: string;
    jobs: string[];
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
}

const sheetDataSchema = z.object({
    id: z.string(),
    name: z.string(),
    jobs: z.array(z.string()),
    monday: z.array(z.string()),
    tuesday: z.array(z.string()),
    wednesday: z.array(z.string()),
    thursday: z.array(z.string()),
    friday: z.array(z.string()),
    saturday: z.array(z.string()),
    sunday: z.array(z.string()),
});

export { ISheetData, ISheetDataDB, sheetDataSchema };