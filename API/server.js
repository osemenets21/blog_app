import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
// import bodyParser from 'body-parser';
import pkg from "bcryptjs";
import bcrypt from "bcryptjs";
const { hashSync, compareSync } = pkg;
import jwt from "jsonwebtoken"; 
const { sign, verify } = jwt; 


const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;
const SECRET_KEY = "your_secret_key";

export const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT,
            password TEXT
        )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          content TEXT,
          category TEXT,
          user_id INTEGER,
          FOREIGN KEY(user_id) REFERENCES users(id)
      )
  `);
});

app.use(express.json());

// function verifyToken(req, res, next) {
//   const token = req.headers["authorization"];
//   if (!token) {
//     return res.status(403).send({ message: "No token provided" });
//   }

//   verify(token, SECRET_KEY, (err, decoded) => {
//     if (err) {
//       return res.status(500).send({ message: "Invalid token" });
//     }
//     req.userId = decoded.id;
//     next();
//   });
// }

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const query =
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  db.run(query, [username, email, hashedPassword], function (err) {
    if (err) {
      return res.status(500).send({ message: "User already exists" });
    }
    res.status(200).send({ message: "User registered!" });
  });
});



app.post('/login', (req, res) => {
  console.log('Request body:', req.body);
  
  const { username, password } = req.body;

  if (!username || !password) {
    console.log('Missing username or password');
    return res.status(400).json({ message: 'Username and password are required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      console.log('Database error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    console.log("Stored hashed password:", user.password);

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    console.log('Login successful');
    return res.status(200).json({ message: 'Login successful', token: token });
  });
});


app.post('/logout', (req, res) => {
  return res.status(200).json({ message: 'Logout successful' });
});

export default app;

app.get('/posts', (req, res) => {
  db.all('SELECT * FROM posts', [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(rows); // Return posts as a JSON array
  });
});



// app.post("/posts", verifyToken, (req, res) => {
//   const { title, content } = req.body;
//   const query = "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)";

//   db.run(query, [title, content, req.userId], function (err) {
//     if (err) {
//       return res.status(500).send({ message: "Помилка при створенні поста" });
//     }
//     res.status(200).send({ id: this.lastID, message: "Пост створено" });
//   });
// });

// app.get("/posts", (req, res) => {
//   const query =
//     "SELECT posts.id, posts.title, posts.content, users.username FROM posts INNER JOIN users ON posts.user_id = users.id";

//   db.all(query, [], (err, posts) => {
//     if (err) {
//       return res.status(500).send({ message: "Error while receiving posts" });
//     }
//     res.status(200).send(posts);
//   });
// });

// app.put("/posts/:id", verifyToken, (req, res) => {
//   const { title, content } = req.body;
//   const query =
//     "UPDATE posts SET title = ?, content = ? WHERE id = ? AND user_id = ?";

//   db.run(query, [title, content, req.params.id, req.userId], function (err) {
//     if (err || this.changes === 0) {
//       return res
//         .status(500)
//         .send({ message: "Error editing or post not found" });
//     }
//     res.status(200).send({ message: "The post has been updated" });
//   });
// });

// app.delete("/posts/:id", verifyToken, (req, res) => {
//   const query = "DELETE FROM posts WHERE id = ? AND user_id = ?";

//   db.run(query, [req.params.id, req.userId], function (err) {
//     if (err || this.changes === 0) {
//       return res.status(500).send({ message: "Error or post not found" });
//     }
//     res.status(200).send({ message: "The post has been deleted" });
//   });
// });

app.listen(PORT, () => {
  console.log(`The server is started on the port - ${PORT}`);
});

