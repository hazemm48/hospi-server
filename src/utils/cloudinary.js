import cloudinary from'cloudinary';
 
cloudinary.v2.config({
  cloud_name: "dff4glrr0",
  api_key: "977345232743829",
  api_secret: "obXIWLxMA9SOfcfunYE78dWgdxw",
  secure:true
});


export default cloudinary.v2;