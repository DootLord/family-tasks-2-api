import { ISheetData, ISheetDataDB, sheetDataSchema } from "../schema/sheet-schema";

class SheetHelper {
    mergeSheet(sheetDataDB: ISheetDataDB): ISheetData { //? This could live in a helper file
        const arrayItems = ['jobs', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const removeQuotesRegex = /['"\\]/g; // This removes quotes AND backslashes from the string

        for (const item of arrayItems) {
            if (sheetDataDB[item]) {
                sheetDataDB[item] = sheetDataDB[item].replace(removeQuotesRegex, '').split(',').map((item: string) => item.trim());
            }
        }

        const parse = sheetDataSchema.safeParse(sheetDataDB);

        if (!parse.success) {
            throw new Error(parse.error.message);
        }

        return parse.data as ISheetData;
    }
}

export const sheetHelper = new SheetHelper();

