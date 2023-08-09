const foodModel = require("../../model/foods/food");
class food {
  //add
  async postfood(req, res) {
    let {
      category,
      subcategory,
      foodname,
      foodprice,
      fooddesc,
      customerofferprice,
      foodvolume,
      foodvolumetype,
      foodfeatures,
    } = req.body;
    let file = req.files[0].filename;
    let file1 = req.files[1].filename;
    let file2 = req.files[2].filename;
    try {
      if (
        !category |
        !subcategory |
        !foodname |
        !foodprice |
        !customerofferprice |
        !foodvolume |
        !foodvolumetype |
        !foodfeatures |
        !fooddesc
      ) {
        return res.status(401).json({ error: "All fields must be required" });
      } else {
        let newfood = new foodModel({
          category,
          subcategory,
          foodname,
          foodprice,
          customerofferprice,
          foodvolume,
          foodfeatures,
          foodvolumetype,
          foodimage: [file, file1, file2],
          fooddesc,
        });
        let save = newfood.save();
        if (save) {
          return res.json({ success: "food created successfully" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  //get
  async getallfoods(req, res) {
    let food = await foodModel.find({}).sort({ _id: -1 });
    if (food) {
      return res.status(200).json({ foods: food });
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  async getcustomerfood(req, res) {
    let subcategory = req.params.subcategory;
    let foods = await foodModel.find({ subcategory: subcategory });

    if (foods) {
      return res.json({ foods: foods });
    }
  }

  //delete
  async deletefood(req, res) {
    let id = req.params.id;
    const data = await foodModel.deleteOne({ _id: id });
    return res.json({ sucess: "Delete successfuly" });
  }

 
  //edit

  async editfood(req, res) {
    let id = req.params.id;
    let {
      category,
      subcategory,
      foodname,
      fooddesc,
      foodprice,
      customerofferprice,
      foodvolume,
      foodvolumetype,
      foodfeatures,
      totalstock,
    } = req.body;

    let data = await foodModel.findOneAndUpdate(
      { _id: id },
      {
        category,
        subcategory,
        foodname,
        fooddesc,
        foodprice,
        foodfeatures,
        customerofferprice,
        foodvolume,
        foodvolumetype,
        totalstock,
      }
    );

    if (data) {
      return res.json({ success: "Updated" });
    }
  }
}

const foodcontroller = new food();
module.exports = foodcontroller;
