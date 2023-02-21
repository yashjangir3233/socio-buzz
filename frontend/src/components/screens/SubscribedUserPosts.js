import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const SubscribedUserPosts = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  async function fetchData() {
    try {
      var res = await fetch("/getsubposts", {
        method: "get",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });

      res = await res.json();
      setData(res.posts);
    } catch (err) {
      return res.json({
        success: false,
        message: err.message,
      });
    }
  }
  //
  useEffect(() => {
    fetchData();
  }, []);

  const likePost = async (id) => {
    try {
      var res = await fetch("/like", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      });

      res = await res.json();
      const { result } = res;

      const newData = data.map((item) => {
        if (item._id == result._id) {
          return result;
        } else {
          return item;
        }
      });

      setData(newData);
    } catch (err) {
      console.log(err);
    }
  };

  const unLikePost = async (id) => {
    try {
      var res = await fetch("/unlike", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      });

      res = await res.json();
      // console.log(res);
      const { result } = res;
      const newData = data.map((item) => {
        if (item._id == result._id) {
          return result;
        } else {
          return item;
        }
      });

      setData(newData);
    } catch (err) {
      console.log(err);
    }
  };

  const makeComment = async (text, postId) => {
    try {
      var res = await fetch("/comment", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          text,
          postId,
        }),
      });

      res = await res.json();

      const { result } = res;
      const newData = data.map((item) => {
        if (item._id == result._id) {
          return result;
        } else {
          return item;
        }
      });

      setData(newData);
    } catch (err) {
      console.log(err);
    }
  };

  const deletePost = async (postId) => {
    try {
      var res = await fetch(`/deletepost/${postId}`, {
        method: "delete",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });

      res = await res.json();
      // console.log(res);

      const { result } = res;
      const newData = data.filter((item) => {
        return item._id != result._id;
      });

      setData(newData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card" key={item._id}>
            <h5 style={{ padding: "6px" }}>
              <Link to={"/profile/" + item.postedBy._id}>
                {" "}
                {item.postedBy.name}{" "}
              </Link>
              {item.postedBy._id == state._id && (
                <i
                  style={{ float: "right" }}
                  className="material-icons"
                  onClick={() => {
                    deletePost(item._id);
                  }}
                >
                  delete
                </i>
              )}
            </h5>
            <div className="card-image">
              <img src={item.photo} />
            </div>
            <div className="card-content">
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => {
                    unLikePost(item._id);
                  }}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => {
                    likePost(item._id);
                  }}
                >
                  thumb_up
                </i>
              )}
              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((comment) => {
                return (
                  <h6 key={comment._id}>
                    <span style={{ fontWeight: "500" }}>
                      {comment.postedBy.name}
                    </span>
                    {" " + comment.text}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="Add comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubscribedUserPosts;
