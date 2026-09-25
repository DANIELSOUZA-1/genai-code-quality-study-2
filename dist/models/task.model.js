"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = void 0;
const database_1 = require("../config/database");
exports.TaskModel = {
    async create(task) {
        const db = await (0, database_1.getDb)();
        const result = await db.run('INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)', [task.title, task.description || '', task.status || 'PENDING', task.user_id]);
        return this.findById(result.lastID);
    },
    async findById(id) {
        const db = await (0, database_1.getDb)();
        return db.get('SELECT * FROM tasks WHERE id = ?', [id]);
    },
    async findAllByUserId(userId) {
        const db = await (0, database_1.getDb)();
        return db.all('SELECT * FROM tasks WHERE user_id = ?', [userId]);
    },
    async findAll() {
        const db = await (0, database_1.getDb)();
        return db.all('SELECT * FROM tasks');
    },
    async update(id, task) {
        const db = await (0, database_1.getDb)();
        const updates = [];
        const values = [];
        if (task.title !== undefined) {
            updates.push('title = ?');
            values.push(task.title);
        }
        if (task.description !== undefined) {
            updates.push('description = ?');
            values.push(task.description);
        }
        if (task.status !== undefined) {
            updates.push('status = ?');
            values.push(task.status);
        }
        if (updates.length === 0)
            return this.findById(id);
        values.push(id);
        await db.run(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`, values);
        return this.findById(id);
    },
    async delete(id) {
        const db = await (0, database_1.getDb)();
        await db.run('DELETE FROM tasks WHERE id = ?', [id]);
    }
};
