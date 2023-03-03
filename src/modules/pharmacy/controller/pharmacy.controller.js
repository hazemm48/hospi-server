import medicineModel from "../../../../database/models/medicine.model.js";

const addMedicine = async (req, res) => {
  let all = req.body;
  try {
    const check = await medicineModel.findOne({ name: all.name });
    if (check) {
      res.json({ message: "Medicine already added" });
    } else {
      const added = await medicineModel.insertMany(all);
      res.json({ message: "Added new medicine", added });
    }
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const getMedicine = async (req, res) => {
  all = req.body;
  try {
    if (all.oper == "all") {
      const allMed = await medicineModel.find();
      res.json({ message: "all Medicines", allMed });
    } else if (!all.oper) {
      const medicine = await medicineModel.find(all);
      res.json({ message: "all medicine", medicine });
    }
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const updateMedicine = async (req, res) => {
  let all = req.body;
  try {
    const updated = await medicineModel.findByIdAndUpdate(all._id, all, {
      new: true,
    });
    res.json({ message: "Updated", updated });
  } catch (error) {
    res.json({ message: "error", error });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    const { _id } = req.body;
    const deleted = await pharmaModel.deleteOne(_id);
    res.json({ message: "Deleted", deleted });
  } catch (error) {
    res.json({ message: "Not Deleted", error });
  }
};

export { deleteMedicine, addMedicine, getMedicine, updateMedicine };
