import medicineModel from "../../../../database/models/medicine.model.js";

const addMedicine = async (req, res) => {
  try {
    const { name, description, category, subcategories, type, quantity, price } = req.body;
    const existingMedicine = await medicineModel.findOne({ name });
    if (existingMedicine) return res.json({ message: "Medicine already exists" });
    if(!name || !description || !category || !subcategories || !type || !quantity || !price) return res.json({ message: "Please fill all fields" });
    const existingCategoryOrSubcategory = await medicineModel.findOne({ category: { name: category, subcategories: [subcategories] } });
    if(!existingCategoryOrSubcategory){
      return res.json({ message: "Category or Subcategory not found" });
    }
    const newMedicine = new medicineModel({ name, description, category: { name: category, subcategories: [subcategories] }, type, quantity, price });
    const saved = await newMedicine.save();
    res.json({ message: "Added", newMedicine });
  } catch (error) {
    res.json({ message: "Not Added", error });
  }
};

const getMedicine = async (req, res) => {
  try{
    const { category , subcategories } = req.body;
    const medicines = await medicineModel.find({category: { name: category, subcategories: [subcategories] }});
    res.json({ message: "Success", medicines });
  } catch(error){
    res.json({ message: "Error", error });
  }
};


const updateMedicine = async (req, res) => {
  try {
    const {id} = req.params;
    const { name, description, category, subcategories, type, quantity, price } = req.body;
    const existingMedicine = await medicineModel.findById(id);
    if(!existingMedicine){
    res.json({ error: "Medicine not found" });  
    }
    const updated = await medicineModel.findByIdAndUpdate(id, { name, description, category: { name: category, subcategories: [subcategories] }, type, quantity, price });
    res.json({ message: "Updated", updated });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const {id} = req.params;
    const deleted = await medicineModel.findByIdAndDelete(id);
    res.json({ message: "Deleted", deleted });
  } catch (error) {
    res.json({ message: "Not Deleted", error });
  }
};

export { deleteMedicine, addMedicine, getMedicine, updateMedicine };
