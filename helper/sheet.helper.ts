import { ISheetData, ISheetDataDB, sheetDataSchema } from "../schema/sheet-schema";

class SheetHelper {
    mergeSheet(sheetDataDB: ISheetDataDB): ISheetData { //? This could live in a helper file
        const sheetData: ISheetData = {
            id: sheetDataDB.id,
            name: sheetDataDB.name,
            jobs: sheetDataDB.jobs.split(','),
            monday: sheetDataDB.monday.split(','),
            tuesday: sheetDataDB.tuesday.split(','),
            wednesday: sheetDataDB.wednesday.split(','),
            thursday: sheetDataDB.thursday.split(','),
            friday: sheetDataDB.friday.split(','),
            saturday: sheetDataDB.saturday.split(','),
            sunday: sheetDataDB.sunday.split(','),
        }

        const parse = sheetDataSchema.safeParse(sheetData);

        if (!parse.success) {
            throw new Error(parse.error.message);
        }

        return parse.data as ISheetData;
    }
}

export const sheetHelper = new SheetHelper();

