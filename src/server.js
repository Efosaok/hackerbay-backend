import '@babel/polyfill'; //eslint-disable-line

import dotenv from 'dotenv'; // eslint-disable-line

import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import winston from 'winston';
import morgan from 'morgan';
import json from 'morgan-json';
import Logsene from 'winston-logsene';

import routes from './routes';
import swaggerJSON from '../swagger.json';

import { stMonitor } from 'sematext-agent-express';

dotenv.config();

stMonitor.start();

const app = express();

const PORT = 8080;

const format = json({
  method: ':method',
  url: ':url',
  status: ':status',
  contentLength: ':res[content-length]',
  responseTime: ':response-time',
});

const logger = winston.createLogger({
  transports: [
    new Logsene({
      token: process.env.LOGS_TOKEN, // token
      level: 'info',
      type: 'api_logs',
      url: 'https://logsene-receiver.sematext.com/_bulk',
    }),
  ],
});

const httpLogger = morgan(format, {
  stream: {
    write: (message) => logger.info('HTTP LOG', JSON.parse(message)),
  },
});

app.use(httpLogger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);

const swaggerDocument = {
  ...swaggerJSON,
  host: `localhost:${PORT}`,
};

app.get('/', (req, res) => {
  logger.info(`API UP AND RUNNING ON PORT ${PORT}`);
  return res
    .status(200)
    .json({ message: 'Welcome to efosa hackerbay microservice' });
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT);

export default app;
