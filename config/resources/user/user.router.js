import express from 'express';
import UserController from './user.controller'

const userRouter = express.Router();
userRouter.route('/')
.post(UserController.signUp)
userRouter.route('/login')
.post(UserController.login)
userRouter.route('/token')
.post(UserController.token)
export default userRouter;