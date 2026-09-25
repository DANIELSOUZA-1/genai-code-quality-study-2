"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const task_model_1 = require("../models/task.model");
const createTask = async (req, res) => {
    const { title, description, status } = req.body;
    const userId = req.user.id;
    const task = await task_model_1.TaskModel.create({
        title,
        description,
        status,
        user_id: userId
    });
    res.status(201).json(task);
};
exports.createTask = createTask;
const getTasks = async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    let tasks;
    if (role === 'ADMIN') {
        tasks = await task_model_1.TaskModel.findAll();
    }
    else {
        tasks = await task_model_1.TaskModel.findAllByUserId(userId);
    }
    res.json(tasks);
};
exports.getTasks = getTasks;
const getTaskById = async (req, res) => {
    const taskId = parseInt(req.params.id);
    const userId = req.user.id;
    const role = req.user.role;
    const task = await task_model_1.TaskModel.findById(taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    if (role !== 'ADMIN' && task.user_id !== userId) {
        return res.status(403).json({ message: 'Access denied to this task' });
    }
    res.json(task);
};
exports.getTaskById = getTaskById;
const updateTask = async (req, res) => {
    const taskId = parseInt(req.params.id);
    const userId = req.user.id;
    const role = req.user.role;
    const { title, description, status } = req.body;
    const task = await task_model_1.TaskModel.findById(taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    if (role !== 'ADMIN' && task.user_id !== userId) {
        return res.status(403).json({ message: 'Access denied to update this task' });
    }
    const updatedTask = await task_model_1.TaskModel.update(taskId, { title, description, status });
    res.json(updatedTask);
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    const taskId = parseInt(req.params.id);
    const userId = req.user.id;
    const role = req.user.role;
    const task = await task_model_1.TaskModel.findById(taskId);
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    if (role !== 'ADMIN' && task.user_id !== userId) {
        return res.status(403).json({ message: 'Access denied to delete this task' });
    }
    await task_model_1.TaskModel.delete(taskId);
    res.status(204).send();
};
exports.deleteTask = deleteTask;
