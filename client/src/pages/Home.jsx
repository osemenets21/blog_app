import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";  // Імпортуємо контекст

const Home = () => {
  const [posts, setPosts] = useState([]);
  const location = useLocation(); 
  const queryParams = new URLSearchParams(location.search); 
  const cat = queryParams.get("cat"); 

  const { message, setMessage } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/posts${cat ? `?cat=${cat}` : ""}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [cat]);

  // Таймер для автоматичного приховування повідомлення через 5 секунд
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(""); // Очищаємо повідомлення через 5 секунд
      }, 5000);

      return () => clearTimeout(timer); // Очищуємо таймер, якщо компонент буде розмонтований
    }
  }, [message, setMessage]);

  return (
    <div className="home">
      {message && ( 
        <div className="notification">
          <p>{message}</p>
        </div>
      )}
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="img">
              <img src={post.img} alt="post-img" />
            </div>
            <div className="content">
              <Link className="link" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
                <p>{post.desc}</p>
                <button>Read more</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

