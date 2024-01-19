import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home/Home";
import styles from "./App.module.css";
import ProtectedRoutes from "../src/components/ProtectedRoutes/ProtectedRoutes";
import Error from "./components/pages/Error/Error";
import Login from "./components/pages/Login/Login";
import { useSelector } from "react-redux";
import Signup from "./components/pages/Signup/Signup";
import Crypto from "./components/pages/Crypto/Crypto";
import Blog from "./components/pages/Blog/Blog";
import SubmitBlog from "./components/pages/SubmitBlog/SubmitBlog";

function App() {
  const isAuth = useSelector((state) => state.user.auth);
  return (
    <div className={styles.container}>
      <BrowserRouter>
        <div className={styles.layout}>
          <Navbar />
          <Routes>
            <Route
              path="/"
              exact
              element={
                <div className={styles.main}>
                  <Home />
                </div>
              }
            />
            <Route
              path="crypto"
              exact
              element={
                <div className={styles.main}>
                  <Crypto />
                </div>
              }
            />
            <Route
              path="blogs"
              exact
              element={
                <ProtectedRoutes isAuth={isAuth}>
                  <div className={styles.main}>
                    <Blog />
                  </div>
                </ProtectedRoutes>
              }
            />
            <Route
              path="submit"
              exact
              element={
                <ProtectedRoutes isAuth={isAuth}>
                  <div className={styles.main}>
                    <SubmitBlog />
                  </div>
                </ProtectedRoutes>
              }
            />
            <Route
              path="login"
              exact
              element={
                <div className={styles.main}>
                  <Login />
                </div>
              }
            />
            <Route
              path="signup"
              exact
              element={
                <div className={styles.main}>
                  <Signup />
                </div>
              }
            />
            <Route
              path="*"
              element={
                <div className={styles.main}>
                  <Error />
                </div>
              }
            />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
