const router = require("express").Router();
const { register, login, SetAvatar, getAllUsers} = require("../controllers/userControllers");

router.post("/register" , register);
router.post("/login" , login);
router.post("/avatar/:id" , SetAvatar);
router.get("/allUsers/:id" , getAllUsers);

module.exports = router;