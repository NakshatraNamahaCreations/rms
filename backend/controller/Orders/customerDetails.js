const customerOrderModel = require("../../model/Orders/customerDetails");
class food {
  //add
  async BookTable(req, res) {
    let { guestName, mobileNumber, noOfPerson, selectedTable, guestEmail } =
      req.body;
    try {
      let customer = new customerOrderModel({
        guestName,
        mobileNumber,
        noOfPerson,
        selectedTable,
        guestEmail,
      });
      const data = await customer.save();
      return res.status(200).json({ success: "Success", user: data });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "An error occurred while booking the table" });
    }
  }

  //get
  async getBookings(req, res) {
    let customer = await customerOrderModel.find({}).sort({ _id: -1 });
    if (customer) {
      return res.status(200).json({ customerDetails: customer });
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
  async getparticularCustomer(req, res) {
    try {
      const _id = req.params.id;
      let customer = await customerOrderModel.findById(_id);
      if (customer) {
        return res.status(200).json({ particulatUser: customer });
      } else {
        return res.status(500).json({ error: "Something went wrong" });
      }
    } catch (error) {
      return res.status(404).json({ error: "No User Found!" });
    }
  }
  //update
  async orderDish(req, res) {
    try {
      const { selectedDishes } = req.body;
      console.log("Received Payload:", req.body);

      if (!Array.isArray(selectedDishes.length === 0)) {
        return res.status(400).json({ message: "Invalid selectedDishes data" });
      }
      const order = new customerOrderModel({
        selectedDishes,
      });
      await order.save();
      res.status(200).json({ message: "Order created successfully", order });
    } catch (error) {
      console.error("Error creating order", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateSelectedDishes(req, res) {
    try {
      const _id = req.params.id;
      const { selectedDishes } = req.body;
      const user = await customerOrderModel.findById(_id);
      if (!user) {
        return { success: false, message: "User not found" };
      }
      user.selectedDishes.push(...selectedDishes);
      // user.selectedDishes = selectedDishes;
      const saveDishes = await user.save();
      if (saveDishes) {
        return res
          .status(200)
          .json({ success: true, message: "Updated Successfully", saveDishes });
      }
    } catch (error) {
      console.error("Error updating selected dishes", error);
      return { success: false, message: "Internal server error" };
    }
  }
}
const customerOrderDetails = new food();
module.exports = customerOrderDetails;
