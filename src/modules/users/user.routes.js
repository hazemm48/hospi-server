import  express  from "express";
const router = express.Router()
import * as userController from './controller/user.controller.js'
import patientRoutes from './patient/patient.routes.js'

router.use('/patient',patientRoutes)
router.post('/signUp',userController.signUp)
router.post('/signIn',userController.signIn)

export default router