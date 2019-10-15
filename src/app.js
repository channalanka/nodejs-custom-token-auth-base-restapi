import express from 'express';
import logger from 'morgan';
import {connect} from '../config/db';
import {restRouter} from '../config/resources/index';
import tokenBasedMiddleware from '../auth/tokenBasedMW';

const app = express();
const PORT =4000;

connect();

app.use(express.json());

app.use(express.urlencoded({extended:true}));
app.use('/',tokenBasedMiddleware);
app.use(logger('dev'));
app.use('/api', restRouter);

app.use((req, res, next) =>{
    const error = new Error("404 Not Found !");
    error.message = "invalid route";
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status|| 500);
    return res.json({
        error: {
            message: error.message
        }
    })
});

app.listen(PORT, ()=>{
    console.log(`server running at port http//:localhost:${PORT}`);
})

