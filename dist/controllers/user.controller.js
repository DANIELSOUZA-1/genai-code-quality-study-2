"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getProfile = void 0;
const user_model_1 = require("../models/user.model");
const getProfile = async (req, res) => {
    const userId = req.user.id;
    const user = await user_model_1.UserModel.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
};
exports.getProfile = getProfile;
const getAllUsers = async (req, res) => {
    // Only admins can access this (enforced by middleware)
    const users = await user_model_1.UserModel.findAll();
    res.json(users);
};
exports.getAllUsers = getAllUsers;
