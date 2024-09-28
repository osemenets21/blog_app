import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: inputs.username,
          email: inputs.email,      
          password: inputs.password,  
        }),
      });

      console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log("Successful registration:", data); 
      } else {
        const errorData = await response.json();
        console.log("Registration error:", errorData.message); 
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="auth">
      <h1>Register</h1>
      <form>
        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={handleChange}
          required 
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          required 
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
          required 
        />
        <button type="submit" onClick={handleSubmit}>Register</button> 
        <p>This is an error!</p>
        <span>
          Do you have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
