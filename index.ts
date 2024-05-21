import express, {Request, Response, NextFunction} from 'express';

const app = express();
const port = process.env.PORT || 5000;
import Prometheus from 'prom-client';
import axios from "axios";

const register = new Prometheus.Registry()
register.setDefaultLabels({
    app: 'prometheus'
})


const metricsInterval = Prometheus.collectDefaultMetrics()
const httpRequestDurationMicroseconds = new Prometheus.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    // buckets for response time from 0.1ms to 1s
    buckets: [0.1, 5, 15, 50, 100],
});

const counter = new Prometheus.Counter({
    name: 'request_count',
    help: 'Duration of HTTP requests in ms',
});

// Runs before each requests
app.use((req, res, next) => {
    res.locals.startEpoch = Date.now()
    next()
})

app.use((req, res, next) => {
    const responseTimeInMs = Date.now() - res.locals.startEpoch
    httpRequestDurationMicroseconds
        .observe({
            method: req.method, route: req.path
        }, responseTimeInMs)
    counter.inc(1)
    next()
})

app.get('/user', (req: Request, res: Response<UserResponse>) => {
    const users: UserResponse = [
        {id: 1, name: 'John Doe'},
        {id: 2, name: 'Jane Doe'}
    ];

    res.json(users);
});

app.get('/', (req, res, next) => {
    setTimeout(() => {
        res.json({message: 'Hello World!'})
        next()
    }, Math.round(Math.random() * 200))
})
app.get('/metrics', async (_req, res) => {
    try {
        res.set('Content-Type', Prometheus.register.contentType);
        res.end(await Prometheus.register.metrics());
    } catch (err) {
        res.status(500).end(err);
    }
});


// Error handler
app.use((err, req, res, next) => {
    res.statusCode = 500
    // Do not expose your error in production
    res.json({error: err.message})
    next()
})

type UserResponse = Array<{
    id: number,
    name: string
}>

app.listen(port, () => {
    console.log(`Server is running  esdfs adsas d ddasdasdsasdasdat http://localhost:${port}`);
    setInterval(() => {
        axios.get("http://localhost:5000/user").then((response) => {
            console.log(response.data, " " + Date.now())
        }).catch(ex => {
            console.log(ex?.message, "err")
        })
        axios.get("http://localhost:5000").then((response) => {
            console.log(response.data, " " + Date.now())
        }).catch(ex => {
            console.log(ex?.message, "err")
        })
    }, 5000)
});

