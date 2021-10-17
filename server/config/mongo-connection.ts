import { serviceConfig } from './config';

const host = process.env.MONGO_HOST || 'localhost';
const mongoport = process.env.MONGO_PORT || '27017';
const database = process.env.DB_NAME || 'bustracker';
const password = process.env.MONGO_PW || '';
const username = process.env.MONGO_USER || ''
const ssl = process.env.MONGO_SSL || false;
const credentials = username ? `${username}:${encodeURIComponent(password)}@` : '';
const environment = serviceConfig.envName;

const connection = {
    env: environment,
    host,
    dbUrl: (process.env.ENV_NAME || 'LOCAL') !== 'LOCAL' ? 
    `mongodb+srv://${credentials}${host}/${database}?retryWrites=true&w=majority`: 
    `mongodb://${credentials}${host}:${mongoport}/${database}?ssl=${ssl}`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
};

export { connection };