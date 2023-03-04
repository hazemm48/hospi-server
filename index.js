import  express  from "express"
import * as dotenv from "dotenv"
dotenv.config()
const app = express()
import { connection } from "./database/connection.js"
import mainRoutes from './src/modules/main.routes.js'

app.use(express.json())
connection()
app.use('/api/v1',mainRoutes)
app.get('/',(req,res)=> res.send("running"))
app.listen(4545,()=> console.log('listening'))