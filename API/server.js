import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
// import bodyParser from 'body-parser';
import pkg from 'bcryptjs';
const { hashSync, compareSync } = pkg; 
// import authRoutes from './routes/authRoutes.js';
// import postRoutes from './routes/postRoutes.js';

const app = express();

app.use(cors());
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'your_secret_key';  

const db = new sqlite3.Database('./database.db');

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
            user_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `);
});

app.use(express.json());

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ message: 'No token provided' });
    }

    verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).send({ message: 'Invalid token' });
        }
        req.userId = decoded.id;
        next();
    });
}

// app.post('/register', (req, res) => {
//     const { username, password } = req.body;
//     const hashedPassword = hashSync(password, 8);

//     const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
//     db.run(query, [username, hashedPassword], function (err) {
//         if (err) {
//             return res.status(500).send({ message: 'User already exists' });
//         }
//         res.status(200).send({ message: 'User registered!' });
//     });
// });

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;  
    const hashedPassword = hashSync(password, 8);  

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    
    db.run(query, [username, email, hashedPassword], function (err) {
        if (err) {
            return res.status(500).send({ message: 'User already exists' });
        }
        res.status(200).send({ message: 'User registered!' });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], (err, user) => {
        if (!user || !compareSync(password, user.password)) {
            return res.status(401).send({ message: 'Invalid login or password' });
        }

        const token = sign({ id: user.id }, SECRET_KEY, { expiresIn: '24h' });
        res.status(200).send({ token });
    });
});


app.post('/posts', verifyToken, (req, res) => {
    const { title, content } = req.body;
    const query = 'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)';

    db.run(query, [title, content, req.userId], function (err) {
        if (err) {
            return res.status(500).send({ message: 'Помилка при створенні поста' });
        }
        res.status(200).send({ id: this.lastID, message: 'Пост створено' });
    });
});


app.get('/posts', (req, res) => {
    const query = 'SELECT posts.id, posts.title, posts.content, users.username FROM posts INNER JOIN users ON posts.user_id = users.id';
    
    db.all(query, [], (err, posts) => {
        if (err) {
            return res.status(500).send({ message: 'Error while receiving posts' });
        }
        res.status(200).send(posts);
    });
});

app.put('/posts/:id', verifyToken, (req, res) => {
    const { title, content } = req.body;
    const query = 'UPDATE posts SET title = ?, content = ? WHERE id = ? AND user_id = ?';

    db.run(query, [title, content, req.params.id, req.userId], function (err) {
        if (err || this.changes === 0) {
            return res.status(500).send({ message: 'Error editing or post not found' });
        }
        res.status(200).send({ message: 'The post has been updated' });
    });
});

app.delete('/posts/:id', verifyToken, (req, res) => {
    const query = 'DELETE FROM posts WHERE id = ? AND user_id = ?';

    db.run(query, [req.params.id, req.userId], function (err) {
        if (err || this.changes === 0) {
            return res.status(500).send({ message: 'Error or post not found' });
        }
        res.status(200).send({ message: 'The post has been deleted' });
    });
});

app.listen(PORT, () => {
    console.log(`The server is started on the port - ${PORT}`);
});
