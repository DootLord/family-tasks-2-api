import mysql from 'mysql';
import { dbConfig } from '../config/mysql';
import { sheetHelper } from '../helper/sheet.helper';
import { Day, DayIndex, ISheetData, ISheetDataDB, IWeekSheet, TaskStatus, weekSheetSchema } from '../schema/sheet-schema';

class SheetService {
    private connection: mysql.Connection;

    constructor() {
        this.connection = mysql.createConnection(dbConfig);
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

        let taskMatrix = Array.from({ length: 7 }, () => Array.from({ length: jobLength }, () => TaskStatus.INCOMPLETE));
        console.log(taskMatrix);
        const taskStatuses = await this.getTaskStatuses(weekSheet.id);

        console.log(taskStatuses);

        taskStatuses.forEach((taskStatus) => {
            console.log(DayIndex[taskStatus.day]);
            console.log(taskStatus['job-index']);
            const { day, 'job-index': jobIndex, status } = taskStatus;
            taskMatrix[DayIndex[day]][jobIndex] = status;
        });

        return taskMatrix;
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


}

export const sheetService = new SheetService();