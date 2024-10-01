import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);

  const location = useLocation(); // Отримуємо об'єкт location
  const queryParams = new URLSearchParams(location.search); // Створюємо об'єкт URLSearchParams
  const cat = queryParams.get("cat"); // Отримуємо значення cat

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

  return (
    <div className="home">
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="img">
              <img src={post.img} alt="post-img" />
            </div>
            <div className="content">
              <Link className="link">
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
