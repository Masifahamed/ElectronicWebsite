import express from 'express'
import { updateproduct,deleteproduct,addproduct,getsingleproduct,getproduct } from '../controllers/productcontroller.js'

const productroute=express.Router()

productroute.post('/',addproduct)
productroute.get('/',getproduct)
productroute.get('/:id',getsingleproduct)
productroute.put('/:id',updateproduct)
productroute.delete('/:id',deleteproduct)

export default productroute;