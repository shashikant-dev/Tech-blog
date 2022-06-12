import React, { useState, useReducer } from "react";
import { Row, Col, Card, Modal, message } from "antd";
import defaultPostImage from "./../../assets/images/default-post-image.jpg";
import {
  EditTwoTone,
  DeleteTwoTone,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { useHistory } from "react-router";
import "./PostsGrid.scss";
import { postsAPI } from "./../../api/api";
import { useSelector } from "react-redux";

const { Meta } = Card;

export default function PostsGrid({
  data,
  reloadPosts,
  likeClick,
  followClick,
}) {
  const router = useHistory();
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletePostID, setDeletePostID] = useState(null);
  const [reload, setReload] = useState(false);
  const userState = useSelector((st) => st.user);

  const confirmDelete = async () => {
    try {
      await postsAPI.delete(deletePostID);
      setReload(!reload);
      reloadPosts(!reload);
      setDeleteModal(false);
      message.success("Post deleted successfully");
    } catch (error) {
      console.log("Error deleting post...", error.response ?? error);
      message.error("Error deleting post");
      if (error.response && error.response.data) {
        message.error(error.response.data);
      } else message.error("Error deleting post");
      setDeleteModal(false);
    }
  };

  return (
    <div>
      <Row className="posts-container" type="flex">
        {data.map((item, i) => (
          <Col xs={24} sm={12} md={8} lg={8} key={item._id}>
            <Card
              hoverable
              cover={
                <div
                  className="image-container"
                  onClick={() =>
                    router.push("/posts/view", { postID: item._id })
                  }
                >
                  <img
                    alt={item.title}
                    src={defaultPostImage}
                    className="card-image"
                  />
                </div>
              }
              actions={
                item.createdBy === userState.user.id
                  ? [
                      <EditTwoTone
                        key="edit"
                        onClick={() =>
                          router.push("/posts/edit", { postID: item._id })
                        }
                      />,

                      <DeleteTwoTone
                        key="delete"
                        twoToneColor="red"
                        onClick={() => {
                          setDeletePostID(item._id);
                          setDeleteModal(true);
                        }}
                      />,

                      // !item.follow && userState.user.id
                      //   ? [
                      //       <button
                      //         className="follow"
                      //         onClick={() => {
                      //           followClick(item._id, userState.user.id);
                      //         }}
                      //       >
                      //         Follow
                      //       </button>,
                      //     ]
                      //   : [
                      //       <button
                      //         className="unfollow"
                      //         onClick={() => {
                      //           followClick(item._id, userState.user.id);
                      //         }}
                      //       >
                      //         Unfollow
                      //       </button>,
                      //     ],

                      !item.like && userState.user.id
                        ? [
                            <HeartOutlined
                              key="like"
                              onClick={() => {
                                likeClick(item._id, userState.user.id);
                              }}
                            />,
                          ]
                        : [
                            <HeartFilled
                              key="like"
                              className="reds"
                              onClick={() => {
                                likeClick(item._id, userState.user.id);
                              }}
                            />,
                          ],
                    ]
                  : !item.like && userState.user.id
                  ? [
                      <HeartOutlined
                        key="like"
                        onClick={() => {
                          likeClick(item._id, userState.user.id);
                        }}
                      />,

                      !item.follow && userState.user.id
                        ? [
                            <button
                              className="follow"
                              onClick={() => {
                                followClick(item._id, userState.user.id);
                              }}
                            >
                              Follow
                            </button>,
                          ]
                        : [
                            <button
                              className="unfollow"
                              onClick={() => {
                                followClick(item._id, userState.user.id);
                              }}
                            >
                              Unfollow
                            </button>,
                          ],
                    ]
                  : [
                      <HeartFilled
                        key="like"
                        className="reds"
                        onClick={() => {
                          likeClick(item._id, userState.user.id);
                        }}
                      />,
                      !item.follow && userState.user.id
                        ? [
                            <button
                              className="follow"
                              onClick={() => {
                                followClick(item._id, userState.user.id);
                              }}
                            >
                              Follow
                            </button>,
                          ]
                        : [
                            <button
                              className="unfollow"
                              onClick={() => {
                                followClick(item._id, userState.user.id);
                              }}
                            >
                              Unfollow
                            </button>,
                          ],
                    ]
              }
            >
              <Meta
                title={item.title}
                description={item.content.substring(0, 100) + "..."}
                onClick={() => router.push("/posts/view", { postID: item._id })}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Delete Confirmation"
        visible={deleteModal}
        onOk={() => confirmDelete()}
        onCancel={() => setDeleteModal(false)}
        centered
      >
        <p>Are you sure you want to delete post?</p>
      </Modal>
    </div>
  );
}
