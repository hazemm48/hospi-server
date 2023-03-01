import joi from "joi";

const signUpSchema = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi.string().alphanum().min(3).max(30).required(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi
        .string()
        .pattern(/^[A-Z][a-z0-9]{3,8}$/)
        .required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),
      city: joi.string().min(3).required(),
      address: joi.string().min(10),
      age: joi.number().integer().min(18).max(100).required(),
      phone: joi
        .string()
        .length(11)
        .pattern(/^[0-9]+$/),
      role:joi.string(),
      diseases:joi.array()
    }),
    
};

const signInSchema = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
      phone: joi
        .string()
        .length(11)
        .pattern(/^[0-9]+$/),
      password: joi
        .string()
        .pattern(/^[A-Z][a-z][a-z0-9]{3,13}$/)
        .required(),
      rememberMe: joi.boolean(),
    })
    .oxor("email", "phone"),
};

const updateUserSchema = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi.string().min(3).max(30),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
      age: joi.number().integer().min(18).max(100),
      address: joi.string().min(10),
      phone: joi.string().min(11).max(20),
      city: joi.string().min(3),
    }),
    headers : {
      userID:joi.string().hex().length(24)
    }
};

export { signUpSchema, signInSchema, updateUserSchema };
