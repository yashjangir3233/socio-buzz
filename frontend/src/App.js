import React, { useEffect, createContext, useReducer, useContext } from "react";

import NavBar from "./components/NavBar/Navbar";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import Signin from "./components/screens/Signin";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import SubscribedUserPosts from "./components/screens/SubscribedUserPosts";
import { initialState, reducer } from "./reducers/userReducer";

export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      navigate("/signin");
    }
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/signin" element={<Signin />}></Route>
      <Route path="/signup" element={<Signup />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/createpost" element={<CreatePost />}></Route>
      <Route path="/profile/:userid" element={<UserProfile />}></Route>
      <Route path="/myfollowingpost" element={<SubscribedUserPosts />}></Route>
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
