import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";

const Createpost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  async function fetchData() {
    try {
      const res = await fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      });

      const data = await res.json();
      if (data.error) {
        M.toast({
          html: data.error,
          classes: "#e53935 red darken-1",
        });
      } else {
        M.toast({
          html: "post created successfully",
          classes: "#4caf50 green",
        });
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (url) {
      fetchData();
    }
  }, [url]);

  const postDetails = async () => {
    try {
      var data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "insta-clone");
      data.append("cloud_name", "sinsak");

      var res = await fetch("https://api.cloudinary.com/v1_1/sinsak/upload", {
        method: "post",
        body: data,
      });
      data = await res.json();
      setUrl(data.url);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="card input-filled"
      style={{
        margin: "10vh auto",
        maxWidth: "40vw",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
        }}
      />
      <div className="file-field input-field">
        <div className="btn #42a5f5 blue darken-1">
          <span>upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #42a5f5 blue darken-1"
        onClick={() => {
          postDetails();
        }}
      >
        create post
      </button>
    </div>
  );
};

export default Createpost;
