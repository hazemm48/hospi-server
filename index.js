import  express  from "express"
import * as dotenv from "dotenv"
import http from 'http'
// import io from 'socket.io'
import cors from 'cors'
dotenv.config()
const app = express()
import { connection } from "./database/connection.js"
import mainRoutes from './src/modules/main.routes.js'
import { globalError } from "./src/services/asyncHandler.js"
import morgan from 'morgan'


const server = http.createServer(app);



app.use(morgan("combined"))
app.use(globalError)
app.use(cors());
app.use(express.json())
app.use('/uploads',express.static("uploads"));
connection()
app.use('/api/v1',mainRoutes)
app.get('/',(req,res)=> res.send("running"))
app.listen(3000,()=> console.log('listening'))