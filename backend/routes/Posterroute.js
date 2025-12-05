import express from "express";
import upload from "../middleware/uploadposterImage.js";
import { addPoster, getHeroData, updateHeroData } from "../controllers/posterController.js";

const posterrouter = express.Router();

posterrouter.get("/", getHeroData);

posterrouter.post("/add",upload.single("imageFile"),addPoster)
// Accept file or URL
posterrouter.put(
  "/update",
  upload.single("imageFile"), 
  updateHeroData
);

export default posterrouter;
