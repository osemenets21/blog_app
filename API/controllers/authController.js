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

  // Додати перевірку на існування користувача
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
  console.log("Login attempt:", req.body);
  const { username, password } = req.body;
  console.log("Checking user:", username);

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) {
      console.log("DB Error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    console.log("Retrieved user:", user);

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid username or password" });
    }

    console.log("User found:", user);
    console.log("Entered password:", password);
    console.log("Stored hashed password:", user.password);

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    console.log("Password comparison result:", isPasswordValid);

    
    
    if (!isPasswordValid) {
      console.log("Invalid password");
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("Password is valid");
    return res.status(200).json({ message: "Login successful", token: token });
  });
};
