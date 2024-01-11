const express = require("express");
const auth = require("../middlewares/auth");
const authController = require("../controller/authController");
const blogController = require("../controller/blogController");
const commentController = require("../controller/commentController");
const router = express.Router();

//testing route

router.get("/test", (req, res) =>
  res.json({ Msg: "Working with test endpoint!" })
);

//auth controller
router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", auth, authController.logout);

router.get("/refresh", authController.refresh);

//blog controller
//create
router.post("/blog", auth, blogController.create);

//get All
router.get("/blog/all", auth, blogController.getAll);

//get blog by id
router.get("/blog/:id", auth, blogController.getById);

//update
router.put("/blog", auth, blogController.update);

//delete
router.delete("/blog/:id", auth, blogController.delete);

//comment controller
//create
router.post("/comment", auth, commentController.create);

//get
router.get("/comment/:id", auth, commentController.getById);
module.exports = router;
