const { Router } = require("express");
const DoThis=require("../controller/functions")
const router=Router()
const multer = require('multer');
const HomeController = require('../controller/HomeController');

router.get("/", HomeController.index)

router.get("/signup",DoThis.singup)
router.post("/signup",DoThis.singup)


router.get(`/VerificationEmail`,DoThis.tokenval)

router.get("/login",DoThis.login)
router.post("/login",DoThis.login)


router.get(`/user/:username`,HomeController.list)
router.get(`/uploads/:username`,HomeController.index)
//router.post(`/user/:username`,DoThis.cookieJWTAuth)


router.get("/user/:username/logout",DoThis.cookieJWTAuth,DoThis.logout)
router.post("/user/:username/logout",DoThis.cookieJWTAuth,DoThis.logout)





// Multer setup for PDF uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
    const username = req.params.username; 
      cb(null, 'public/' + username +'/pdfs');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
      req.uploadError = 'Only .pdf format allowed!';
    } 
}
})




router.get(`/user/:username`,DoThis.cookieJWTAuth, HomeController.index);
router.post(`/user/:username/upload`,DoThis.cookieJWTAuth, upload.single('pdf'), HomeController.upload);
router.get(`/user/:username/uploads`,DoThis.cookieJWTAuth, HomeController.list);
router.get(`/user/:username/delete/:filename`,DoThis.cookieJWTAuth, HomeController.delete);
router.get(`/user/:username/download/:filename`,DoThis.cookieJWTAuth, HomeController.download);
router.get(`/user/:username/view/:filename`,DoThis.cookieJWTAuth, HomeController.view);
router.get(`/user/:username/rename/:filename`,DoThis.cookieJWTAuth, HomeController.renameForm);
router.post(`/user/:username/rename/:oldFilename`,DoThis.cookieJWTAuth, HomeController.rename);

module.exports = router;













module.exports=router