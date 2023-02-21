import React, { useContext } from "react";
import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";

const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/profile">Profile</Link>
        </li>,
        <li>
          <Link to="/createpost">Create Post</Link>
        </li>,
        <li>
          <Link to="/myfollowingpost">My following Posts</Link>
        </li>,
        <li>
          <button
            className="btn waves-effect waves-light #ef5350 red lighten-1"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              navigate("/signin");
            }}
          >
            logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/signin">login</Link>
        </li>,
        <li>
          <Link to="/signup">SignUp</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          Socio Buzz
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
