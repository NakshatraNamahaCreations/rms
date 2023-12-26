const express = require("express");
const router = express.Router();
const foodcontroller = require("../../controller/foods/food");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/food");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/addfood",
  // upload.any(),
  foodcontroller.postfood
);
router.get("/getallfood", foodcontroller.getallfoods);
router.get("/getcustomerfood/:subcategory", foodcontroller.getcustomerfood);
router.post("/editfood/:id", upload.any(), foodcontroller.editfood);
router.post("/deletefood/:id", foodcontroller.deletefood);

module.exports = router;
