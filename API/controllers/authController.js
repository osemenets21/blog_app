import bcrypt from "bcryptjs";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database.db");

export const registerUser = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required" });
  }

  db.get(
    "SELECT * FROM users WHERE username = ? OR email = ?",
    [username, email],
    (err, user) => {
      if (err) {
        console.log("DB Error:", err);
        return res.status(500).json({ message: "Server error" });
      }
      if (user) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }

      const hashedPassword = bcrypt.hashSync(password, 8);
      db.run(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword],
        function (err) {
          if (err) {
            console.log("Error during registration:", err);
            return res
              .status(500)
              .json({ message: "Error during registration" });
          }
          return res
            .status(201)
            .json({ message: "User created", userId: this.lastID });
        }
      );
    }
  );
};



export const loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.log('DB Error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid username or password' });
    }

  
    return res.status(200).json({ message: 'User found', user: { id: user.id, username: user.username } });
  });
};

