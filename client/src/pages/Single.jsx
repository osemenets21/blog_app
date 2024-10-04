import React, { useState, useEffect, useContext } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useLocation } from "react-router-dom";
import Menu from "../components/Menu";
import moment from "moment";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Single = () => {
  const [post, setPost] = useState({});
  const location = useLocation();
  const postId = location.pathname.split("/")[2];
  const { currentUser, setMessage } = useContext(AuthContext);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/post/${postId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPost(data);        
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user?.token || null;

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(`http://localhost:5000/post/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  
        },
      });

      if (response.ok) {
        setMessage("Post has been deleted!");

        navigate("/");  

        console.log("Post deleted successfully");
      } else {
        console.error("Failed to delete post");
      }

    } catch (error) {
      console.log("Error deleting post:", error);
    }
  };

  return (
    <div className="single">
      <div className="content">
        <img src={post?.img} alt="single-photo" />

        {currentUser && (
          <div className="user">
            <img
              src="https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png"
              alt="single-user"
            />
            <div className="info">
              <span>{post.username}</span>
              <p>Posted {moment(post.date).fromNow()}</p>
            </div>
            {currentUser?.username === post?.username && (
              <div className="edit">
                <Link to={"/write?edit=2"} state={post}>
                  <img src={Edit} alt="edit-img" />
                </Link>
                <img onClick={handleDelete} src={Delete} alt="delete-img" />
              </div>
            )}
          </div>
        )}

        <h1>{post.title}</h1>
        <p>{post.desc}</p>
      </div>
      <Menu cat={post.cat} currentPostId={post.id}/>
    </div>
  );
};

export default Single;

