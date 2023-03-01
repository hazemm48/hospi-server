import  express  from "express";
const router = express.Router()
import * as userController from './controller/user.controller.js'
import patientRoutes from './patient/patient.routes.js'
import adminRoutes from './admin/admin.routes.js'
import validation from "../middleware/validation.js";
import * as validSchema from "../middleware/user.validation.js"
import auth from "../middleware/auth.js";

router.use('/admin',adminRoutes)
router.use('/patient',auth,patientRoutes)
router.post('/signUp',validation(validSchema.signUpSchema),userController.signUp)
router.post('/signIn',validation(validSchema.signInSchema),userController.signIn)

export default router