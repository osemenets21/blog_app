import React, { useContext } from "react";
import Logo from "../img/logo.png";
import { Link, useNavigate  } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => { 
    await logout();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to={"/"}>
            <img src={Logo} alt="logo" />
          </Link>
        </div>
        <div className="links">
          <Link className="link" to="/?cat=art">
            <h6>ART</h6>
          </Link>

          <Link className="link" to="/?cat=science">
            <h6>SCIENCE</h6>
          </Link>

          <Link className="link" to="/?cat=technology">
            <h6>TECHNOLOGY</h6>
          </Link>

          <Link className="link" to="/?cat=cinema">
            <h6>CINEMA</h6>
          </Link>

          <Link className="link" to="/?cat=design">
            <h6>DESIGN</h6>
          </Link>

          <Link className="link" to="/?cat=food">
            <h6>FOOD</h6>
          </Link>

          {currentUser && ( 
            <span>
              <FontAwesomeIcon
                icon={faUser}
                style={{ color: "#b9e7e7", marginRight: "5px" }}
              />
              {currentUser.username} 
            </span>
          )}
          {currentUser ? (
            <span className="bg-green" onClick={handleLogout} >Logout</span>
          ) : (
            <Link className="link bg-green" to="/login">
              Login
            </Link>
          )}
          <span className="write">
            <Link className="link" to="/write">
              Write
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
