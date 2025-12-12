import express from "express";
import upload from "../middleware/uploadposterImage.js";
import { addPoster, getHeroData, updateHeroData } from "../controllers/posterController.js";

const posterrouter = express.Router();

posterrouter.get("/", getHeroData);

posterrouter.post("/add",upload.single("imageFile"),addPoster)
// Accept file or URL
posterrouter.put("/update",upload.single("imageFile"), updateHeroData);

export default posterrouter;


// import express from "express";
// import upload from "../middleware/uploadposterImage.js";
// import { addPoster, deletePoster, getAllPosters,getHeroData,getPosterById, getTrendingPoster, updatePoster } from "../controllers/posterController.js";

// const posterrouter = express.Router();

// posterrouter.get("/", getAllPosters);
// posterrouter.get("/herodata",getHeroData)
// posterrouter.get("/:id",getPosterById)
// posterrouter.post("/add",upload.single("imageFile"),addPoster)
// // Accept file or URL
// posterrouter.put("/update/:id",upload.single("imageFile"),updatePoster)
// posterrouter.delete("/delete/:id",deletePoster);
// posterrouter.get("/trending",getTrendingPoster)

// export default posterrouter;
