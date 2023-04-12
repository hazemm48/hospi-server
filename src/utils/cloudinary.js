// import path from 'path'
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';
// const __dirname = path.dirname(fileURLToPath(import.meta.url))
// // dotenv.config({path:path.join(__dirname,'../../config/.env')})
import cloudinary from'cloudinary';
 
cloudinary.v2.config({
  cloud_name: "dff4glrr0",
  api_key: "977345232743829",
  api_secret: "obXIWLxMA9SOfcfunYE78dWgdxw",
  secure:true
});


export default cloudinary.v2;