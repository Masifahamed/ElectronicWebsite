import express from 'express'
import { deleteUser, getsingleuser, getUser,updateUser, createUser,deleteall} from '../controllers/UserController.js'


const userroute=express.Router()

userroute.post('/newuser',createUser)
userroute.get('/getuser',getUser)
userroute.get('/getsingleuser/:id',getsingleuser)
userroute.put('/updateuser/:id',updateUser)
userroute.delete('/deleteuser/:id',deleteUser)
userroute.delete('/deleteall',deleteall)


export default userroute;

// userroute.post('/creatuser',RegisterUser)
//userroute.post("/loginauth",loginUser)
//userroute.get("/checkemail/:email",emailcheck)