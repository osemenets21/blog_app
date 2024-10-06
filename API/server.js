import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import pkg from "bcryptjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const { hashSync, compareSync } = pkg;
const { sign, verify } = jwt;
const app = express();
app.use(cors());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.use('/upload', express.static(path.join(__dirname, './upload')));


app.post("/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ filename: file.filename }); 
});

const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; 

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

  db.run(
    `CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      desc TEXT,
      img TEXT,
      date TEXT,
      cat TEXT,
      username TEXT
      
  )`,
    (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      } else {
        console.log("Posts table created successfully or already exists.");
      }
    }
  );
});


app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  db.run(query, [username, email, hashedPassword], function (err) {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send({ message: "User already exists" });
    }
    res.status(200).send({ message: "User registered!" });
  });
});


app.post("/login", (req, res) => {
  console.log("Request body:", req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    console.log("Missing username or password");
    return res.status(400).json({ message: "Username and password are required" });
  }

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.log("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("Login successful");
    return res.status(200).json({  token: token });
  });
});


app.post("/logout", (req, res) => {
  return res.status(200).json({ message: "Logout successful" });
});


app.get("/posts", (req, res) => {
  const { cat } = req.query;

  let query = "SELECT * FROM posts";
  const params = [];

  if (cat) {
    query += " WHERE cat = ?";
    params.push(cat);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.status(200).json(rows);
  });
});


app.get("/post/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM posts WHERE id = ?";

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    if (!row) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(row);
  });
});


app.post("/posts", (req, res) => {
  const { title, desc, img, date, cat, username } = req.body;

  const query = "INSERT INTO posts (title, desc, img, date, cat, username) VALUES (?, ?, ?, ?, ?, ?)";

  db.run(query, [title, desc, img, date, cat, username], function (err) {
    if (err) {
      console.error("Error inserting post:", err);
      return res.status(500).json({ message: "Error creating post" });
    }
    res.status(201).json({ message: "Post created successfully", id: this.lastID });
  });
});


app.put("/post/:id", (req, res) => {
  const { id } = req.params;
  const { title, desc, img, cat } = req.body;

  const query = "UPDATE posts SET title = ?, desc = ?, img = ?, cat = ? WHERE id = ?";

  db.run(query, [title, desc, img, cat, id], function (err) {
    if (err) {
      console.error("Error updating post:", err);
      return res.status(500).json({ message: "Error updating post" });
    }
    res.status(200).json({ message: "Post updated successfully" });
  });
});


app.delete("/post/:id", (req, res) => {
  const query = "DELETE FROM posts WHERE id = ?";

  db.run(query, [req.params.id], function (err) {
    if (err || this.changes === 0) {
      return res.status(500).send({ message: "Error or post not found" });
    }
    res.status(200).send({ message: "The post has been deleted" });
  });
});


function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }

  verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).send({ message: "Invalid token" });
    }
    req.userId = decoded.id;
    next();
  });
}


app.listen(PORT, () => {
  console.log(`The server is started on the port - ${PORT}`);
});
