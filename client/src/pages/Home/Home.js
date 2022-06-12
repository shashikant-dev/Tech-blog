import React, { useEffect, useState } from "react";
import Jumbotron from "../../components/Jumbotron/Jumbotron";
import "./Home.scss";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button, Row, Col, Divider, Card, Spin, Alert } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { postsAPI } from "../../api/api";
import { useSelector } from "react-redux";
import PostsGrid from "../../components/PostsGrid/PostsGrid";

export default function Home() {
  const router = useHistory();
  const userState = useSelector((st) => st.user);
  const [postsData, setPostsData] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [errorMsg, setErrorMsg] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

  const likeUnlike = async (id, access) => {
    try {
      await postsAPI.likeUnlike(id);
      setReload(reload == true ? false : true);
      } catch (error) {}
      if (!access) {
        router.push("/login");
      }

  };

  const followUnfollow = async (id, access) => {
    try {
      await postsAPI.followUnfollow(id);
      setReload(reload == true ? false : true);
    } catch (error) {
    }
    if (!access) {
      router.push("/login");
    }

  };

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await postsAPI.getAll();
        setPostsData(res);
        setErrorMsg(null);
      } catch (error) {
        setErrorMsg("Error loading posts data");
        console.log("Error retrieving all posts...", error);
      }
    })();
  }, [reload]);

  return (
    <div className="home">
      {userState.isLoggedIn ? (
        <>
          <Jumbotron>
            <div className="home-jumbotron">
              <div className="centered-section">
                <h4>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem
                  ipsum dolor sit amet consectetur adipisicing elit.
                </h4>
                <h2>Hello, Everyone</h2>
                <Button
                  type="primary"
                  shape="round"
                  icon={<RightCircleOutlined />}
                  size="large"
                  onClick={() => router.push("/posts/new")}
                >
                  Write a now post!
                </Button>
              </div>
            </div>
          </Jumbotron>
        </>
      ) : (
        <>
          <Jumbotron>
            <div className="home-jumbotron">
              <>
                <div className="left-section">
                  <h4>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </h4>
                  <h2>Hello, Everyone</h2>
                  <Button
                    type="primary"
                    shape="round"
                    icon={<RightCircleOutlined />}
                    size="large"
                    onClick={() => router.push("/login")}
                  >
                    Get Started
                  </Button>
                </div>
              </>
            </div>
          </Jumbotron>
        </>
      )}
      {/* <Divider orientation="center">Most recent posts</Divider> */}
      {errorMsg ? (
        <div className="loader-container">
          <Alert message={errorMsg} type="error" />
        </div>
      ) : postsData && Boolean(postsData.length) ? (
        <PostsGrid
          data={postsData.reverse()}
          likeClick={(e) => likeUnlike(e)}
          followClick={(e) => followUnfollow(e)}
          reloadPosts={(param) => setReload(param)}
        />
      ) : (
        <div className="loader-container">No Record Found!</div>
      )}
    </div>
  );
}
