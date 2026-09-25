"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../utils/jwt");
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const existingUser = await user_model_1.UserModel.findByEmail(email);
    if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await user_model_1.UserModel.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'USER'
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
        message: 'User registered successfully',
        user: userWithoutPassword
    });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await user_model_1.UserModel.findByEmail(email);
    if (!user || !user.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email, role: user.role });
    res.json({
        message: 'Login successful',
        token
    });
};
exports.login = login;
