import express from "express"
import { authenlogin, createDefaultadmin} from "../controllers/authController.js"


const loginroutes=express.Router()

loginroutes.post("/checklogin",authenlogin)
loginroutes.get('/admindefault',createDefaultadmin)

export default loginroutes