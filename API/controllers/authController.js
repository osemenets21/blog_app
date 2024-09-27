import bcrypt from 'bcryptjs'; 
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db');

export const registerUser = (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);
  db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Error during registration' });
    }
    return res.status(201).json({ message: 'User created', userId: this.lastID });
  });
};
