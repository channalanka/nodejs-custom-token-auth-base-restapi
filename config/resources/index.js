import express from 'express';
import  {songRouter} from './song/song.router';
import userRouter from './user/user.router';

export const restRouter = express.Router();
restRouter.use('/song', songRouter);
restRouter.use('/user', userRouter);