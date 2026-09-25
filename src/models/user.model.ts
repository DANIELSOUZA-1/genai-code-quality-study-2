import { getDb } from '../config/database';

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  created_at?: string;
}

export const UserModel = {
  async create(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const db = await getDb();
    const result = await db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [user.name, user.email, user.password, user.role]
    );
    return { ...user, id: result.lastID };
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const db = await getDb();
    return db.get<User>('SELECT * FROM users WHERE email = ?', [email]);
  },

  async findById(id: number): Promise<Omit<User, 'password'> | undefined> {
    const db = await getDb();
    return db.get('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
  },

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const db = await getDb();
    return db.all('SELECT id, name, email, role, created_at FROM users');
  }
};
