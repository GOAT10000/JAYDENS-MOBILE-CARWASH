import express  from "express";
import morgan from "morgan";
import cors from "cors";
import { appointRouter, authRouter, userRouter } from "./routes/userRoutes.js";


const app = express();

app.options('*', cors(['http://localhost:4200', 'http://localhost:46500']));
app.use(cors(['http://localhost:4200', 'http://localhost:46500']));

app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended:true, limit: '10kb'}));


const port = 8888;

if(process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/appointment', appointRouter)

const server = app.listen(port, () => console.log(`Listening on port ${port}`));
