import mysql from 'mysql';
import { sheetHelper } from '../helper/sheet.helper';
import { Day, DayIndex, ISheetData, ISheetDataDB, ISheetTemplate, IWeekSheet, TaskStatus, weekSheetSchema } from '../schema/sheet-schema';

class SheetService {
    private connection: mysql.Connection;
    private dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }

    constructor() {
        this.connection = mysql.createConnection(this.dbConfig);
        this.connection.connect();
    }

    async setTaskStatus(day: Day, index: number, status: TaskStatus = TaskStatus.COMPLETE): Promise<void> {
        const latestWeekSheet = await this.getLatestWeekSheet();
        const taskQuery = 'INSERT INTO `task-status` (`week-sheet-id`, `day`, `job-index`, `status`) VALUES (?, ?, ?, ?)';
        const taskValues = [latestWeekSheet.id, day, index, status];

        return new Promise((resolve, reject) => {
            this.connection.query(taskQuery, taskValues, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
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

    async fetchWeekStatus() {
        const weekSheet = await this.getLatestWeekSheet();
        const taskSheet = await this.fetchSheetById(weekSheet['task-sheet-id']);
        const jobLength = taskSheet.jobs.length;

        let taskMatrix = Array.from({ length: 7 }, () => Array.from({ length: jobLength }, () => { return { status: TaskStatus.INCOMPLETE, "updated": 0 } })
        );
        const taskStatuses = await this.getTaskStatuses(weekSheet.id);

        taskStatuses.forEach((taskStatus) => {
            const { day, 'job-index': jobIndex, status, updated } = taskStatus;
            taskMatrix[DayIndex[day]][jobIndex].status = status;
            taskMatrix[DayIndex[day]][jobIndex].updated = updated;
        });

        return taskMatrix;
    }

    async generateNewSheet(sheet: string): Promise<string> {
        const sheetTemplate = await this.getSheetTemplate(sheet);
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO `week-sheet` (`task-sheet-id`, `start`) VALUES (?, ?)';
            const dateNow = Date.now() / 1000;
            this.connection.query(query, [sheetTemplate.id, dateNow], (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            });
        });
    }

    private fetchSheetById(id: string): Promise<ISheetData> {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM `task-sheet` WHERE id = ?';
            this.connection.query(query, [id], (err, rows) => {
                if (err) return reject(err);
                const sheetDataDB: ISheetDataDB = rows[0];
                resolve(sheetHelper.mergeSheet(sheetDataDB));
            });
        });
    }

    private getTaskStatuses(weekSheetId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM `task-status` WHERE `week-sheet-id` = ?';
            this.connection.query(query, [weekSheetId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    private getLatestWeekSheet(): Promise<IWeekSheet> {
        return new Promise((resolve, reject) => {
            const weekSheet = 'SELECT * FROM `week-sheet` ORDER BY start DESC LIMIT 1';
            this.connection.query(weekSheet, (err, rows) => {
                if (err) return reject(err);
                const parse = weekSheetSchema.safeParse(rows[0]);
                if (!parse.success) {
                    return reject(parse.error.message);
                }
                resolve(parse.data as IWeekSheet);
            });
        });
    }

    private getSheetTemplate(sheetName: string = "default"): Promise<ISheetTemplate> {
        const query = 'SELECT * FROM `task-sheet` WHERE name = ?';
        return new Promise((resolve, reject) => {
            this.connection.query(query, [sheetName], (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0]);
            });
        });
    }


}

export const sheetService = new SheetService();