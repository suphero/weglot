import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import config from './config';
import ProjectsRoutes from './routes/projects.routes';
import PublicRoutes from './routes/public.routes';
import TranslateRoutes from './routes/translate.routes';

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}))

// parse requests of content-type - application/json
app.use(bodyParser.json())

const getLoggerForStatusCode = (statusCode: number) => {
    if (statusCode >= 500) {
        return console.error.bind(console)
    }
    if (statusCode >= 400) {
        return console.warn.bind(console)
    }

    return console.log.bind(console)
}

// const logRequestStart = (req: ApiRequest, res: Response, next: NextFunction) => {
const logRequestStart = (req: any, res: any, next: any) => {
    console.info(`${req.method} ${req.originalUrl}`)

    const cleanup = () => {
        res.removeListener('finish', logFn)
        res.removeListener('close', abortFn)
        res.removeListener('error', errorFn)
    }

    const logFn = () => {
        cleanup()
        const logger = getLoggerForStatusCode(res.statusCode)
        logger(`${res.statusCode} ${res.statusMessage}; ${res.get('Content-Length') || 0}b sent`)
    }

    const abortFn = () => {
        cleanup()
        console.warn('Request aborted by the client')
    }

    const errorFn = (err: any) => {
        cleanup()
        console.error(`Request pipeline error: ${err}`)
    }

    res.on('finish', logFn) // successful pipeline (regardless of its response)
    res.on('close', abortFn) // aborted pipeline
    res.on('error', errorFn) // pipeline internal error

    next()
}

app.use(logRequestStart)

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(config.dbUrl, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
    res.send("Welcome to Weglot application.");
});

// listen for requests
app.listen(config.port, () => {
    console.log("Server is listening on port " + config.port);
});

TranslateRoutes(app);
PublicRoutes(app);
ProjectsRoutes(app);