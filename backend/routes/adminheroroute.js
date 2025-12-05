import express from "express";
import { 
    getHeroProducts, 
    addHeroProduct, 
    deleteHeroProduct, 
    clearHeroProducts, 
    updateOrder, 
    updateHeroProduct,
    getsingleProducts
} from "../controllers/adminheroController.js";

const herorouter = express.Router();

herorouter.get("/", getHeroProducts);
herorouter.post("/add", addHeroProduct);
herorouter.put("/updateorder", updateOrder);
herorouter.delete("/delete/:id", deleteHeroProduct);
herorouter.delete("/clearall", clearHeroProducts);
herorouter.put('/updatehero/:id',updateHeroProduct)
herorouter.get('/getsingleproduct/:id',getsingleProducts)

export default herorouter;
