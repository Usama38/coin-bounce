import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home/Home";
import styles from "./App.module.css";
function App() {
  return (
    <div className={styles.container}>
      <BrowserRouter>
        <div>
          <Navbar />
          <Routes>
            <Route path="/home" exact element={<Home />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
