import {Task} from "../model/TaskModel.js";
import mongoose from "mongoose";

export const CreateTask = async (req, res) => {
    let reqBody = req.body;
    try {
        reqBody.user_id = req.headers['userId'];
        let task = await Task.create(reqBody)
        return res.json({status:"success", message: "Task Created successfully", data:task})
    } catch (error) {
        return res.json({status:"fail", message: error.toString()})
    }
}

export const UpdateTaskStatus = async (req, res) => {
    try {
        let id = req.params.id;
        let status = req.params.status;
        let userId = req.headers['userId'];
        await Task.updateOne(
            {'_id': id, 'user_id': userId},
            {status: status}
        )
        return res.json({status:"success", message: "Task Updated successfully"})
    } catch (error) {
        return res.json({status:"fail", message: error.toString()})
    }
}

export const TaskListByStatus = async (req, res) => {
    try {
        let status = req.params.status;
        let userId = req.headers['userId']
        let data = await Task.find({
            user_id: userId,
            status: status
        })
        return res.json({status:"success", message: "Tasks retrieved successfully", data: data});
    } catch (error) {
        return res.json({status:"fail", message: error.toString()})
    }
}

export const DeleteTask = async (req, res) => {
    try {
        let id = req.params.id;
        let userId = req.headers['userId'];
        await Task.deleteOne({'_id': id, 'user_id': userId})
        return res.json({status:"success", message: "Task Deleted successfully"})
    } catch (error) {
        return res.json({status:"fail", message: error.toString()})
    }
}

export const CountTask = async (req, res) => {
    try {
        let userId = new mongoose.Types.ObjectId(req.headers['userId']);
        let data = await Task.aggregate([
            {
                $match:{user_id:userId}
            },
            {
                $group:{_id:"$status", sum:{$count:{}}},
            }
        ])
        return res.json({status:"success", message: "Task Count Retrieved successfully", data: data});
    } catch (error) {
        return res.json({status:"fail", message: error.toString()})
    }
}