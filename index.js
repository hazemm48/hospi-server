import  express  from "express"
import * as dotenv from "dotenv"
import cors from 'cors'
dotenv.config()
const app = express()
import { connection } from "./database/connection.js"
import mainRoutes from './src/modules/main.routes.js'

app.use(cors());
app.use(express.json())
app.use('/uploads',express.static("uploads"));
connection()
app.use('/api/v1',mainRoutes)
app.get('/',(req,res)=> res.send("hellooo"))
app.listen(3000,()=> console.log('listening'))