import express from 'express';
import cors from 'cors';
import bodyparser from 'body-parser';

//imports
import config from './config';
import botRoute from './routes/botRoute';

const app = express();

app.use(cors());

app.use(bodyparser.json());

app.use('/', botRoute);

app.listen(config.PORT, () => {
    console.log(`server is running at port ${config.PORT}`);
});

