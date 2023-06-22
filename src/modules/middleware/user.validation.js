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
        .min(6)
        .max(15)
        .required(),
      role:joi.string(),
    }),
    
};

const signInSchema = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi
        .string()
        .min(6)
        .max(15)
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
