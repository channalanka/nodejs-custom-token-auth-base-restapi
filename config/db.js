import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export const connect = () => mongoose.connect('mongodb://localhost:27017/streams');