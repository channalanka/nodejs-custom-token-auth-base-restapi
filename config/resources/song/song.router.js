import express from 'express';
import SongController from './song.controller';

export const songRouter = express.Router();
songRouter.route('/')
.post(SongController.create)
.get(SongController.getAll);
songRouter.route('/:id')
.get(SongController.get)
.delete(SongController.delete)
.put(SongController.update)