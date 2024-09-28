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


export const loginUser = (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({ message: 'Login successful', userId: user.id });
  });
};