import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");

  async function fetchData() {
    var res = await fetch("/myposts", {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    });

    res = await res.json();
    setPics(res.posts);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const updatePhotoHelper = async () => {
    var data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "sinsak");

    var res = await fetch("https://api.cloudinary.com/v1_1/sinsak/upload", {
      method: "post",
      body: data,
    });

    data = await res.json();
    localStorage.setItem("user", JSON.stringify({ ...state, pic: data.url }));
    dispatch({ type: "UPDATEPIC", payload: data.url });
    // console.log(data.url);

    res = await fetch("/updatepic", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        pic: data.url,
      }),
    });
    const { result } = res;
  };

  useEffect(() => {
    if (image) {
      updatePhotoHelper();
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div
      style={{
        maxWidth: "70vw",
        margin: "0px auto",
      }}
    >
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <img
              style={{ width: "160px", heigth: "160px", borderRadius: "80px" }}
              src={state ? state.pic : "loading"}
            />
          </div>

          <div>
            <h4>{state ? state.name : "loading"}</h4>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "116%",
              }}
            >
              <h6> {mypics.length} posts</h6>
              <h6> {state ? state.followers.length : 0} followers</h6>
              <h6> {state ? state.following.length : 0} following</h6>
            </div>
          </div>
        </div>
        <div className="file-field input-field">
          <div className="btn #42a5f5 blue darken-1">
            <span>update pic</span>
            <input
              type="file"
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
      </div>
      <div className="gallery">
        {mypics.map((item) => {
          return <img className="item" src={item.photo} alt={item.title} />;
        })}
      </div>
    </div>
  );
};

export default Profile;
