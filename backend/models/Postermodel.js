import mongoose from "mongoose";

const posterSchema = new mongoose.Schema({
  category:
    { type: String },
  title: {
    type: String,
  },
  productname: {
    type: String
  },
  price: {
    type: Number
  },
  originalprice: {
    type: Number
  },
  days: {
    type: Number
  },
  hours: {
    type: Number

  },
  minutes: {
    type: Number
  },
  seconds: {
    type: Number
  },
  buttonText: {
    type: String
  },
  imageurl: {
    type: String
  },
  backgroundColor: {
    type: String
  },
  textColor: {
    type: String
  },
  accentColor: {
    type: String
  },
  categoryTextColor: {
    type: String
  },
  buttonColor: {
    type: String
  },
  buttonTextColor: {
    type: String

  }

}, { timestamps: true });

const Postermodel = mongoose.model("poster", posterSchema);

export default Postermodel
