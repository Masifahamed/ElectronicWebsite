import express from 'express'
import { changeproduct, getAllproduct, newArrival, newProduct, removeproduct } from '../controllers/NewArrivalController.js'


const Arrivalroute=express.Router()

Arrivalroute.get('/allproduct',getAllproduct)

Arrivalroute.get("/newarrival",newArrival)

Arrivalroute.post("/createproduct",newProduct)

Arrivalroute.put("/updateproduct/:id",changeproduct)

Arrivalroute.delete("/deleteproduct/:id",removeproduct)

export default Arrivalroute