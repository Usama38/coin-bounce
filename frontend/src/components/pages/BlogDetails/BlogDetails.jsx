import { useEffect, useState } from "react";
import styles from "./BlogDetails.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  deleteBlog,
  getBlogById,
  getCommentsById,
  postComment,
} from "../../../api/internal";
import CommentList from "../../CommentList/CommentList";
function BlogDetails() {
  const [blog, setBlog] = useState([]);
  const [comments, setComments] = useState([]);
  const [ownsBlog, setOwnsBlog] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const blogId = params.id;
  const username = useSelector((state) => state.user.username);
  const userId = useSelector((state) => state.user.id);

  const postCommentHandler = async () => {
    const data = {
      author: userId,
      blog: blogId,
      content: newComment,
    };
    const response = await postComment(data);

    if (response.status === 201) {
      setNewComment("");
      setReload(!reload);
    }
  };

  const deleteBlogHandler = async () => {
    const response = await deleteBlog(blogId);
    if (response.status === 200) {
      navigate("/");
    }
  };
  useEffect(() => {
    async function getBlogDetails() {
      const commentResponse = await getCommentsById(blogId);
      if (commentResponse.status === 200) {
        setComments(commentResponse.data.data);
      }

      const blogResponse = await getBlogById(blogId);
      if (blogResponse.status === 200) {
        setBlog(blogResponse.data.blog);
      }
    }
    getBlogDetails(); //same IIFE effect
  }, [reload]);

  return (
    <div className={styles.detailsWrapper}>
      <div className={styles.left}>
        <h1 className={styles.title}>{blog.title}</h1>
        <div className={styles.meta}>
          <p>{`@${blog.author} on ${new Date(
            blog.createdAt
          ).toDateString()}`}</p>
        </div>
        <div className={styles.photo}>
          <img src={blog.photo} alt="blogImage" width={250} height={250} />
        </div>
        <p className={styles.content}>{blog.content}</p>
        {ownsBlog && (
          <div className={styles.controls}>
            <button className={styles.edit} onClick={() => {}}>
              Edit
            </button>
            <button className={styles.delete} onClick={deleteBlogHandler}>
              Delete
            </button>
          </div>
        )}
      </div>
      <div className={styles.right}>
        <div className={styles.commentsWrapper}>
          <CommentList />
          <div className={styles.postComment}>
            <input
              type="text"
              className={styles.input}
              placeholder="Comments goes here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className={styles.postCommentButton}
              onClick={postCommentHandler}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BlogDetails;