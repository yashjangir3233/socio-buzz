import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";

const Signin = () => {
  const { state, dispatch } = useContext(UserContext);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const postData = async () => {
    try {
      if (
        !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        )
      ) {
        M.toast({
          html: "Please enter a valid email",
          classes: "#e53935 red darken-1",
        });
        return;
      }

      const res = await fetch("/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          email,
        }),
      });

      const data = await res.json();
      if (data.error) {
        M.toast({
          html: data.error,
          classes: "#e53935 red darken-1",
        });
      } else {
        console.log(data);
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch({ type: "USER", payload: data.user });

        M.toast({
          html: "signed in successfully",
          classes: "#4caf50 green",
        });
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Socio Buzz</h2>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #42a5f5 blue darken-1"
          onClick={() => postData()}
        >
          Login
        </button>
        <h5>
          <Link to="/signup"> Don't have an account ?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signin;
