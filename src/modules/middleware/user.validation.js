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
      password: joi.string().min(6).max(15).required(),
      role: joi.string(),
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
      password: joi.string().min(6).max(15).required(),
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
  headers: {
    userID: joi.string().hex().length(24),
  },
};

const reservationSchema = joi.object({
  params: joi.string().required(),
  body: joi
    .object()
    .keys({
      patName: joi.string().min(3).max(30).required(),
      type: joi.string().valid("doctor", "lab", "rad").required(),
      docName: joi
        .string()
        .min(3)
        .max(30)
        .when("type", { is: "doctor", then: joi.required() }),
      fees: joi.number().min(0).max(999).required(),
      speciality: joi
        .string()
        .when("type", { is: "doctor", then: joi.required() }),
      visitType: joi
        .string()
        .when("type", { is: "doctor", then: joi.required() }),
      day: joi.string().when("type", { is: "doctor", then: joi.required() }),
      doctorId: joi.string().when("type", {
        is: "doctor",
        then: joi.required(),
        otherwise: joi.forbidden(),
      }),
      productId: joi
        .string()
        .when("type", { is: ["lab", "rad"], then: joi.required() }),
      patientId: joi.string().optional(),
      date: joi
        .string()
        .pattern(/^\d{2}-\d{2}-\d{4}$/)
        .required(),
      anotherPerson: joi.boolean().optional(),
    })
    .when("params", { is: "reserve", then: joi.required(),otherwise:joi.forbidden() }),
});

export { signUpSchema, signInSchema, updateUserSchema, reservationSchema };
