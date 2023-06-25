const validation = (schema) => {
  return (req, res, next) => {
    let obj = {
      body: req.body,
    };
    req.params && (obj.params = req.params);
    console.log(obj);
    let valid = schema.validate( obj , { abortEarly: false });
    let paramsValid = schema.validate(req.params, { abortEarly: false });
    if (valid.error) {
      res.status(404).json({ message: "error", errors: valid.error });
    } else if (schema.params && paramsValid.error) {
      res.status(404).json({ message: "error", errors: paramsValid.error });
    } else {
      next();
    }
  };
};

export default validation;
