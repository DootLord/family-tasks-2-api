import mysql from 'mysql';
import { dbConfig } from '../config/mysql';
import { sheetHelper } from '../helper/sheet.helper';
import { ISheetData, ISheetDataDB } from '../schema/sheet-schema';


class SheetService {
    private connection: mysql.Connection;

    constructor() {
        this.connection = mysql.createConnection(dbConfig);
        this.connection.connect();
    }

    fetchSheet(sheetName: string): Promise<ISheetData> {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM ?? WHERE name = ?';
            const values = ['task-sheet', sheetName];


            this.connection.query(query, values, (err, rows) => {
                if (err) return reject(err);
                const sheetDataDB: ISheetDataDB = rows[0];
                resolve(sheetHelper.mergeSheet(sheetDataDB));
            });
        });
    }


}

export const sheetService = new SheetService();