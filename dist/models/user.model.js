"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = require("../config/database");
exports.UserModel = {
    async create(user) {
        const db = await (0, database_1.getDb)();
        const result = await db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [user.name, user.email, user.password, user.role]);
        return { ...user, id: result.lastID };
    },
    async findByEmail(email) {
        const db = await (0, database_1.getDb)();
        return db.get('SELECT * FROM users WHERE email = ?', [email]);
    },
    async findById(id) {
        const db = await (0, database_1.getDb)();
        return db.get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
    },
    async findAll() {
        const db = await (0, database_1.getDb)();
        return db.all('SELECT id, name, email, role, created_at FROM users');
    }
};
