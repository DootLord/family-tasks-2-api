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

export interface ISheetTemplate {
    id: string;
    'task-sheet-id': string;
    start: number;
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


const weekSheetSchema = z.object({
    id: z.string(),
    'task-sheet-id': z.string(),
    start: z.number()
});

enum TaskStatus {
    COMPLETE = 'complete',
    INCOMPLETE = 'incomplete',
    DEFERRED = 'deferred'
}

enum Day {
    MONDAY = 'monday',
    TUESDAY = 'tuesday',
    WEDNESDAY = 'wednesday',
    THURSDAY = 'thursday',
    FRIDAY = 'friday',
    SATURDAY = 'saturday',
    SUNDAY = 'sunday'
}

export enum DayIndex {
    monday = 0,
    tuesday = 1,
    wednesday = 2,
    thursday = 3,
    friday = 4,
    saturday = 5,
    sunday = 6
}

interface IWeekSheet {
    id: string;
    "task-sheet-id": string;
    start: number;
}

export { ISheetData, ISheetDataDB, sheetDataSchema, weekSheetSchema, TaskStatus, Day, IWeekSheet };