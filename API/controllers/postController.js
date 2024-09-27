import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./database.db');

// Get all posts
export const getPosts = (req, res) => {
  db.all('SELECT * FROM posts', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving posts' });
    }
    return res.json(rows);
  });
};

// Get post by ID
export const getPostById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.json(row);
  });
};

// Create a new post
export const createPost = (req, res) => {
  const { title, content, authorId } = req.body; // Add authorId if needed

  db.run('INSERT INTO posts (title, content, authorId) VALUES (?, ?, ?)', [title, content, authorId], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error creating post' });
    }
    return res.status(201).json({ message: 'Post created', postId: this.lastID });
  });
};

// Update post
export const updatePost = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  db.run('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error updating post' });
    }
    return res.json({ message: 'Post updated' });
  });
};

// Delete post
export const deletePost = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM posts WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ message: 'Error deleting post' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    return res.json({ message: 'Post deleted' });
  });
};
