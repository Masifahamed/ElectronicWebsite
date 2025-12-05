import mongoose from "mongoose";

const posterSchema = new mongoose.Schema({
  category: String,
  title: String,
  productname: String,
  price: Number,
  originalprice: Number,
  days: Number,
  hours: Number,
  minutes: Number,
  seconds: Number,
  buttonText: String,
  imageurl: String,
  backgroundColor: String,
  textColor: String,
  accentColor: String,
  categoryTextColor: String,
  buttonColor: String,
  buttonTextColor: String

}, { timestamps: true });

const Postermodel = mongoose.model("poster", posterSchema);

export default Postermodel
