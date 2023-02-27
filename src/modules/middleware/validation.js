const validation = (schema) => {
  return (req, res, next) => {
    let valid = schema.body.validate(req.body, { abortEarly: false });
    if (valid.error) {
      res.json({ message: "error", errors: valid.error });
    } else {
      next();
    }
  };
};

export default validation;
