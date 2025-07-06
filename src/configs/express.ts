import 'dotenv/config';

import express from 'express';
import http from 'http';

import { JSONParseError } from '../middlewares/JSONParseError';

import { router } from '../rotas';

import { CorsConfig } from './cors';
import { MorganConfig } from './morgan';
import { YupConfig } from './yup';

const app = express();

YupConfig.startConfigYup();
MorganConfig.setupMorganBody(app);

app.use(express.json({ limit: '5mb' })); // máximo 5mb
app.use(JSONParseError);
app.use(CorsConfig.corsMiddleware);
app.use(express.json());
app.use(router);

const serverHttp = http.createServer(app);

export const ExpressConfig = { app, serverHttp };
