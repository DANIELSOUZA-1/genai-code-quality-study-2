import { getDb } from '../config/database';

export interface Task {
  id?: number;
  title: string;
  description: string;
  status: string;
  user_id: number;
  created_at?: string;
}

export const TaskModel = {
  async create(task: Omit<Task, 'id' | 'created_at'>): Promise<Task> {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)',
      [task.title, task.description || '', task.status || 'PENDING', task.user_id]
    );
    return this.findById(result.lastID!) as Promise<Task>;
  },

  async findById(id: number): Promise<Task | undefined> {
    const db = await getDb();
    return db.get<Task>('SELECT * FROM tasks WHERE id = ?', [id]);
  },

  async findAllByUserId(userId: number): Promise<Task[]> {
    const db = await getDb();
    return db.all<Task[]>('SELECT * FROM tasks WHERE user_id = ?', [userId]);
  },

  async findAll(): Promise<Task[]> {
    const db = await getDb();
    return db.all<Task[]>('SELECT * FROM tasks');
  },

  async update(id: number, task: Partial<Omit<Task, 'id' | 'user_id' | 'created_at'>>): Promise<Task | undefined> {
    const db = await getDb();
    const updates: string[] = [];
    const values: any[] = [];

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

    if (updates.length === 0) return this.findById(id);

    values.push(id);
    await db.run(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  },

  async delete(id: number): Promise<void> {
    const db = await getDb();
    await db.run('DELETE FROM tasks WHERE id = ?', [id]);
  }
};
