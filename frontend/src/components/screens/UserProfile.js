import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";

const UserProfile = () => {
  const [userProfile, setProfile] = useState();
  const { userid } = useParams();
  const { state, dispatch } = useContext(UserContext);
  const [showFollow, setShowFollow] = useState(
    state ? (state.following.includes(userid) ? false : true) : true
  );

  async function fetchData() {
    var res = await fetch(`/user/${userid}`, {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    });

    res = await res.json();

    console.log(res.posts);

    setProfile(res);
  }

  const followUser = async () => {
    var res = await fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    });

    res = await res.json();
    const { result } = res;

    dispatch({
      type: "UPDATE",
      payload: {
        following: result.following,
        followers: result.followers,
      },
    });

    localStorage.setItem("user", JSON.stringify(result));

    setProfile((prevState) => {
      return {
        ...prevState,
        user: {
          ...prevState.user,
          followers: [...prevState.user.followers, result._id],
        },
      };
    });
    setShowFollow(false);
  };

  const unFollowUser = async () => {
    var res = await fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    });

    res = await res.json();
    const { result } = res;

    dispatch({
      type: "UPDATE",
      payload: {
        following: result.following,
        followers: result.followers,
      },
    });

    localStorage.setItem("user", JSON.stringify(result));

    setProfile((prevState) => {
      const newFollowers = prevState.user.followers.filter((item) => {
        return item != result._id;
      });

      return {
        ...prevState,
        user: {
          ...prevState.user,
          followers: newFollowers,
        },
      };
    });
    setShowFollow(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {userProfile ? (
        <div
          style={{
            maxWidth: "70vw",
            margin: "0px auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                style={{
                  width: "160px",
                  heigth: "160px",
                  borderRadius: "80px",
                }}
                src={userProfile.user.pic}
              />
            </div>
            <div>
              <h4>{userProfile.user.name}</h4>
              <h5>{userProfile.user.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "116%",
                }}
              >
                <h6> {userProfile.posts.length} posts</h6>
                <h6> {userProfile.user.followers.length} followers</h6>
                <h6> {userProfile.user.following.length} following</h6>
              </div>
              {showFollow ? (
                <button
                  style={{ margin: "10px" }}
                  className="btn waves-effect waves-light #42a5f5 blue darken-1"
                  onClick={() => followUser()}
                >
                  follow
                </button>
              ) : (
                <button
                  style={{ margin: "10px" }}
                  className="btn waves-effect waves-light #42a5f5 red darken-1"
                  onClick={() => unFollowUser()}
                >
                  unfollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>loading...</h2>
      )}
    </>
  );
};

export default UserProfile;
