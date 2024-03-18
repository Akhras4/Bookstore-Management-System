const { Router } = require("express");
const DoThis=require("../controller/functions")
const router=Router()



router.get("/signup",DoThis.singup)
router.post("/signup",DoThis.singup)


router.get(`/VerificationEmail`,DoThis.tokenval)

router.get("/login",DoThis.login)
router.post("/login",DoThis.login)


router.get(`/user/:username`,DoThis.cookieJWTAuth,DoThis.user)
router.post(`/user/:username`,DoThis.cookieJWTAuth)


router.get("/user/:username/logout",DoThis.cookieJWTAuth,DoThis.logout)
router.post("/user/:username/logout",DoThis.cookieJWTAuth,DoThis.logout)













module.exports=router