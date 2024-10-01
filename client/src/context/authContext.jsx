import { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // const navigate = useNavigate(); // Викликаємо useNavigate всередині компонента

  const login = async (inputs) => {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: inputs.username,
        password: inputs.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    localStorage.setItem(
        "user",
        JSON.stringify({
          token: data.token,
          username: inputs.username,
          password: inputs.password
        })
    );
    
    setCurrentUser({
      token: data.token,
      username: inputs.username,
      password: inputs.password,
    });
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error("Failed to log out from the server");
      }
  
      localStorage.removeItem("user");
      setCurrentUser(null);
  
      console.log("Logout successful");
      // navigate("/"); // Навігація після успішного виходу

    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
