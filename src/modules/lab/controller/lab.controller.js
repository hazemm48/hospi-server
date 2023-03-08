import labModel from "../../../../database/models/lab.model.js";

const addLab = async (req, res) => {
    let all = req.body;
    try {
      const check = await labModel.findOne({ name: all.name });
      if (check) {
        res.json({ message: "Lab already added" });
      } else {
        const added = await labModel.insertMany(all);
        res.json({ message: "Added new Lab", added });
      }
    } catch (error) {
      res.json({ message: "error", error });
    }
  };

  const getLab = async (req, res) => {
    let  all = req.body;
    try {
      if (all.oper == "all") {
        const allLab = await labModel.find();
        res.json({ message: "all Labs", allLab });
      } else if (!all.oper) {
        const lab = await labModel.find(all);
        res.json({ message: "all Labs", lab });
      }
    } catch (error) {
      res.json({ message: "error", error });
    }
  };

  const updateLab = async (req, res) => {
    let all = req.body;
    try {
      const updated = await labModel.findByIdAndUpdate(all._id, all, {
        new: true,
      });
      res.json({ message: "Updated", updated });
    } catch (error) {
      res.json({ message: "error", error });
    }
  };

  const deleteLab = async (req, res) => {
    try {
      const { _id } = req.body;
      const deleted = await labModel.deleteOne(_id);
      res.json({ message: "Deleted", deleted });
    } catch (error) {
      res.json({ message: "Not Deleted", error });
    }
  };



  export { addLab,
    getLab ,
    updateLab,
    deleteLab
}