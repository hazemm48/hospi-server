import  express  from "express"
import * as dotenv from "dotenv"
dotenv.config()
const app = express()
import { connection } from "./database/connection.js"
import userRoutes from './src/modules/users/user.routes.js'

app.use(express.json())
connection()
app.use('/api/v1',userRoutes)
app.get('/',(req,res)=> res.send("running"))
app.listen(3000,()=> console.log('listening'))