const multer = require("multer")

const upload = multer({
  // dest: "images",
  limits: {
    fileSize: 1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(new RegExp(/\.(png|jpg|jpeg)$/))){
      cb(new Error("File must be an image"))
      return
    }
    cb(undefined, true)
  }
})

module.exports = upload