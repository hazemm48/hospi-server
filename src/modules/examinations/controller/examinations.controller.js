import examiModel from "../../../../database/models/examin.model.js";

const addExamin = async (req, res) => {
    let all = req.body;
    try {
      const check = await examiModel.findOne({ name: all.name });
      if (check) {
        res.json({ message: "Examination already added" });
      } else {
        const addedEamin = await examiModel.insertMany(all);
        res.json({ message: "Added new Examination", addedEamin });
      }
    } catch (error) {
      res.json({ message: "error", error });
    }
  };


  const getExamin = async (req, res) => {
    let all = req.body;
    try {
      if (all.oper == "all") {
        const allExamin = await examiModel.find();
        res.json({ message: "all Examination", allExamin });
      } else if (!all.oper) {
        const examin = await examiModel.find(all);
        res.json({ message: "all Examination", examin });
      }
    } catch (error) {
      res.json({ message: "error", error });
    }
  };


  const updateExamin = async (req, res) => {
    let all = req.body;
    try {
      const updatedExamin = await examiModel.findByIdAndUpdate(all._id, all, {
        new: true,
      });
      res.json({ message: "Updated", updatedExamin });
    } catch (error) {
      res.json({ message: "error", error });
    }
  };

  const deleteExamin = async (req, res) => {
    try {
      const { _id } = req.body;
      const deletedExamin = await examiModel.deleteOne(_id);
      res.json({ message: "Deleted", deletedExamin });
    } catch (error) {
      res.json({ message: "Not Deleted", error });
    }
  };  



export {
    addExamin,
    getExamin,
    updateExamin,
    deleteExamin
}  

