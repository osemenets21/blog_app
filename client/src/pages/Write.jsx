import React, { useState, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../context/AuthContext";

const Write = () => {
  const state = useLocation().state;
  const [desc, setValue] = useState(state?.desc || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");

  const navigate = useNavigate();
  const { setMessage } = useContext(AuthContext);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Upload failed: ${errorMessage}`);
      }

      const data = await response.json();
      return data.filename;
    } catch (err) {
      console.log("Error uploading file:", err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const userFromLocalStor = JSON.parse(localStorage.getItem("user"));

    if (!userFromLocalStor || !userFromLocalStor.token) {
      console.log("Login first please");
      
      setMessage("Login first please");
      return;
    }

    if (!file || !title.trim() || !desc.trim() || !cat.trim()) {
      alert("Missing required fields");
      return;
    }

    const imgUrl = await upload();
    const fullImgUrl = `http://localhost:5000/upload/${imgUrl}`;
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user ? user.username : null;

    try {
      const postData = {
        title,
        desc: desc,
        cat,
        img: file ? fullImgUrl : "",
        date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        username: username,
      };

      if (state) {
        await fetch(`http://localhost:5000/post/${state.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
        setMessage("Post has been updated!");
      } else {
        await fetch("http://localhost:5000/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
        setMessage("Post has been added!");
      }
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <textarea
            className="editor"
            value={desc}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            name="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          <div className="buttons">
            <button>Save as a draft</button>
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "art"}
              name="cat"
              value="art"
              id="art"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="art">Art</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "science"}
              name="cat"
              value="science"
              id="science"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="science">Science</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "technology"}
              name="cat"
              value="technology"
              id="technology"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="technology">Technology</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "cinema"}
              name="cat"
              value="cinema"
              id="cinema"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="cinema">Cinema</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "design"}
              name="cat"
              value="design"
              id="design"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="design">Design</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "food"}
              name="cat"
              value="food"
              id="food"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="food">Food</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
