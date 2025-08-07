const { Signup, Login } = require("../controllers/AuthController.js");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/hello", (req, res) => res.send("Hello World"));

module.exports = router;
