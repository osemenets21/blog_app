import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Menu = ({ cat, currentPostId }) => { 
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/posts?cat=${cat}`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        const filteredPosts = data.filter(post => post.id !== currentPostId);
        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    };

    if (cat) { 
      fetchData();
    }
  }, [cat, currentPostId]); 

  return (
    <div className="menu">
      <h1>Other posts you may like</h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <Link className="link" to={`/post/${post.id}`} key={post.id}>
            <div className="post" key={post.id}>
            <img src={post.img} alt="post-img" />
            <h2>{post.title}</h2>
            <button>Read More</button>
          </div>
          </Link>
          
        ))
      ) : (
        <p>No other posts available.</p> 
      )}
    </div>
  );
};

export default Menu;
