import Postermodel from "../models/Postermodel.js";

// Add new poster
export const addPoster = async (req, res) => {
  try {
    let imageurl = "";

    if (req.file) {
      imageurl = `/uploads/hero-images/${req.file.filename}`;
    } else if (req.body.imageurl) {
      imageurl = req.body.imageurl;
    }

    const newPoster = new Postermodel({
      category: req.body.category,
      title: req.body.title,
      originalprice: String(req.body.originalprice),
      productname: String(req.body.productname),
      price: Number(req.body.price),
      days: Number(req.body.days),
      hours: Number(req.body.hours),
      minutes: Number(req.body.minutes),
      seconds: Number(req.body.seconds),
      imageurl: imageurl,
    });

    const savedPoster = await newPoster.save();
    res.status(201).json({ success: true, data: savedPoster });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get poster
export const getHeroData = async (req, res) => {
  try {
    const hero = await Postermodel.findOne();
   return res.status(200).json({ success: true, data: hero || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update poster
export const updateHeroData = async (req, res) => {
  try {
    let poster = await Postermodel.findOne();
    if (!poster) {
      return res.status(404).json({ success: false, message: "Poster not found" });
    }
    if (req.file) {
      poster.imageurl = `/uploads/hero-images/${req.file.filename}`
    }
    else if(req.body.imageurl){  
      poster.imageurl=req.body.imageurl;
    }
    // Update text fields
    Object.assign(poster, {
      category: req.body.category ?? poster.category,
      title: req.body.title ?? poster.title,
      productname: req.body.productname ?? poster.productname,
      price: req.body.price ? Number(req.body.price) : poster.price,
      originalprice: req.body.originalprice ? Number(req.body.originalprice) : poster.originalprice,
      days: req.body.days ? Number(req.body.days) : poster.days,
      hours: req.body.hours ? Number(req.body.hours) : poster.hours,
      minutes: req.body.minutes ? Number(req.body.minutes) : poster.minutes,
      seconds: req.body.seconds ? Number(req.body.seconds) : poster.seconds,
      buttonText: req.body.buttonText ?? poster.buttonText,
      backgroundColor: req.body.backgroundColor ?? poster.backgroundColor,
      textColor: req.body.textColor ?? poster.textColor,
      accentColor: req.body.accentColor ?? poster.accentColor,
      buttonColor: req.body.buttonColor ?? poster.buttonColor,
      categoryTextColor: req.body.categoryTextColor ?? poster.categoryTextColor,
      buttonTextColor: req.body.buttonTextColor ?? poster.buttonTextColor,
    });


    const updated = await poster.save();
    res.json({ success: true, data: updated });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
