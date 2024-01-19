import { useEffect, useState } from "react";
import styles from "./Blog.module.css";
import { getAllBlogs } from "../../../api/internal";
import Loader from "../../Loader/Loader";
import { useNavigate } from "react-router-dom";
function Blog() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    (async function getAllBlogsApiCall() {
      const response = await getAllBlogs();
      if (response.status === 200) {
        setBlogs(response.data.blogs);
      }
    })();
  }, []);

  if (blogs.length === 0) {
    return <Loader text="Blogs" />;
  }
  return (
    <div className={styles.blogsWrapper}>
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className={styles.blog}
          onClick={() => navigate(`/blog/${blog._id}`)}
        >
          <h1>{blog.title}</h1>
          <img src={blog.photo} alt="blog_Image" />
          <p>{blog.content}</p>
        </div>
      ))}
    </div>
  );
}
export default Blog;
