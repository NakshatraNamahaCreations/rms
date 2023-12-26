const express = require("express");
const router = express.Router();
const customerOrderDetails = require("../../controller/Orders/customerDetails");

router.post("/addbooking", customerOrderDetails.BookTable);
router.get("/getcustomerbooking", customerOrderDetails.getBookings);
router.get(
  "/getparticularcustomerbookingdetails/:id",
  customerOrderDetails.getparticularCustomer
);
router.put(
  "/addcustomerordereddish/:id",
  customerOrderDetails.updateSelectedDishes
);

module.exports = router;
