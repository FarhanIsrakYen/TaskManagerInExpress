import express from 'express';

const router = express.Router();

import * as TaskController from '../app/controllers/TaskController.js';
import * as UserController from '../app/controllers/UserController.js';
import AuthMiddleware from "../app/middlewares/AuthMiddleware.js";

// user
router.post('/registration', UserController.Registration);
router.post('/login', UserController.Login);
router.get('/user', AuthMiddleware, UserController.ProfileDetails);
router.put('/user', AuthMiddleware, UserController.ProfileUpdate);
router.get('/email/verify/:email', UserController.EmailVerify);
router.post('/code/verify', UserController.CodeVerify);
router.post('/password/reset', UserController.ResetPassword);

// task
router.post('/task', AuthMiddleware, TaskController.CreateTask);
router.put('/task/:id/:status', AuthMiddleware, TaskController.UpdateTaskStatus);
router.get('/task/list/:status', AuthMiddleware, TaskController.TaskListByStatus);
router.delete('/task/:id', AuthMiddleware, TaskController.DeleteTask);
router.get('/task/count', AuthMiddleware, TaskController.CountTask);

export default router;