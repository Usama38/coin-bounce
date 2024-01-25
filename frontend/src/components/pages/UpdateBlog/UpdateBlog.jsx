import { useNavigate, useParams } from "react-router-dom";
import styles from "./UpdateBlog.module.css";
import { useState, useEffect } from "react";
import { getBlogById, updateBlog } from "../../../api/internal";
import TextInput from "../../TextInput/TextInput";
import { useSelector } from "react-redux";
function UpdateBlog() {
  const author = useSelector((state) => state.user._id);
  const params = useParams();
  const blogId = params.id;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [photo, setPhoto] = useState("");

  const getPhoto = (e) => {
    const file = e.target.files[0]; //access photo
    const reader = new FileReader();
    reader.readAsDataURL(file); //via FileReader pass into base64
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
  };

  const updateHandler = async () => {
    let data;
    if (photo.includes("http")) {
      data = {
        author,
        title,
        content,
        blogId,
      };
    } else {
      data = {
        author,
        title,
        content,
        photo,
        blogId,
      };
    }

    const response = await updateBlog(data);

    if (response.status === 200) {
      navigate("/");
    }
  };

  useEffect(() => {
    async function getBlogDetails() {
      const response = await getBlogById(blogId);
      if (response?.status === 200) {
        setTitle(response.data.blog.title);
        setContent(response.data.blog.content);
        setPhoto(response.data.blog.photo);
      }
    }
    getBlogDetails();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>Edit your blog!</div>
      <TextInput
        type="text"
        name="title"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "60%" }}
      />
      <textarea
        className={styles.content}
        placeholder="Your content goes here..."
        maxLength={400}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className={styles.photoPrompt}>
        <p>Choose a file</p>
        <input
          type="file"
          name="photo"
          id="photo"
          accept="image/jpg, image/jpeg, image/png"
          onChange={getPhoto}
        />
        <img src={photo} width={150} height={150} alt="selectedImage" />
      </div>
      <button className={styles.update} onClick={updateHandler}>
        Update
      </button>
    </div>
  );
}
export default UpdateBlog;
