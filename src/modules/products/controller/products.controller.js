import productModel from "../../../../database/models/product.model.js";
import AppError from "../../../utils/AppError.js";
import catchAsyncError from "../../middleware/catchAsyncError.js";

const createProduct = catchAsyncError(async (req, res, next) => {
  let all = req.body;
  const products = await productModel.find({
    name: all.name,
    categoryId: all.categoryId,
  });
  if (products.length > 0) {
    return next(new AppError("product already exist", 404));
  }
  let add = await productModel.insertMany(all);
  res.status(201).json({ message: "added", add });
});

const getAllProducts = catchAsyncError(async (req, res, next) => {
  let { filter, sort, pageNo, limit } = req.body;
  pageNo <= 0 || !pageNo ? (pageNo = 1) : pageNo * 1;
  limit <= 0 || !limit ? (limit = 0) : limit * 1;
  let skipItems = (pageNo - 1) * limit;

  if (filter.name) {
    filter.name = { $regex: filter.name, $options: "i" };
  }

  let products = await productModel
    .find(filter)
    .skip(skipItems)
    .limit(limit)
    .collation({ locale: "en" })
    .sort(sort)
    
  let count = await productModel.countDocuments({
    ...filter,
    function(err, count) {
      return count;
    },
  });
  if (products.length > 0) {
    res.json({ message: "done", products, count });
  } else {
    next(new AppError("not found", 404));
  }
});

const updateProduct = catchAsyncError(async (req, res, next) => {
  let { id, data } = req.body;
  data.available = JSON.parse(data.available);
  let product = await productModel.findById(id);
  let allProducts = await productModel.find({ categoryId: product.categoryId });
  let check = allProducts.some((e) => {
    if (data.name == e.name && e._id != id) {
      return true;
    } else {
      return false;
    }
  });
  if (check) {
    next(new AppError("product already exists"), 404);
  } else {
    product.set(data);
    const updated = await product.save();
    res.json({ message: "product updated", updated });
  }
});

/*const deleteProduct = deleteOne(productModel); */

export { createProduct, getAllProducts, updateProduct };
