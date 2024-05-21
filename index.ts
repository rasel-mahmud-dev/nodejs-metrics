import express, {Request, Response, NextFunction} from 'express';

const app = express();
const port = process.env.PORT || 5000;
import {collectDefaultMetrics, register, Histogram, Counter} from 'prom-client';
import axios from "axios";


app.get('/metrics', async (_req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (err) {
        res.status(500).end(err);
    }
});


const httpRequestTimer = new Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    // buckets for response time from 0.1ms to 1s
    buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500, 1000],
});



const headCounter = new Counter({
    name: 'header_count',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    // buckets for response time from 0.1ms to 1s
});


app.use((req: Request, res: Response, next: NextFunction) => {
    const p = req?.path
    if(p) {
        httpRequestTimer.observe({
            method: req.method,
            route: req.path,
            code: req.statusCode
        }, Math.random() * 10)


    }

    next()
    // httpRequestTimer()
})


app.get('/user', (req: Request, res: Response<UserResponse>) => {
    const users: UserResponse = [
        {id: 1, name: 'John Doe'},
        {id: 2, name: 'Jane Doe'}
    ];

    res.json(users);
});

app.get('/',  (req, res) => {
    res.send('Hello, world!');
});


type UserResponse = Array<{
    id: number,
    name: string
}>

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    collectDefaultMetrics();
    setInterval(() => {
        axios.get("http://localhost:5000/user").then((response) => {
            console.log(response.data, " " + Date.now())
        })
    }, 100)
});

