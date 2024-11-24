import express from 'express';
import sheetRoute from './routes/sheet-route';
const app = express();

app.use(express.json());

app.use('/sheet', sheetRoute);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
