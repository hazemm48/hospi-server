import  express  from "express";
const router = express.Router()
import * as userController from './users/controller/user.controller.js'
import patientRoutes from './users/patient/patient.routes.js'
import pharmacyRoutes from './pharmacy/pharmacy.routes.js'
import doctorRoutes from './users/doctor/doctor.routes.js'
import adminRoutes from './users/admin/admin.routes.js'
import labRoutes from './lab/lab.routes.js'
import roomRoutes from './room/room.routes.js'
import validation from "./middleware/validation.js";
import * as validSchema from "./middleware/user.validation.js"
import {auth,adminAuth} from "./middleware/auth.js";


router.use('/admin',adminAuth,adminRoutes)
router.use('/patient',auth,patientRoutes)
router.use('/doctor',auth,doctorRoutes)
router.use('/pharmacy',auth,pharmacyRoutes)
router.use('/lab',auth,labRoutes)
router.use('/room',auth,roomRoutes)
router.post('/signUp',validation(validSchema.signUpSchema),userController.signUp)
router.post('/signIn',validation(validSchema.signInSchema),userController.signIn)

export default router