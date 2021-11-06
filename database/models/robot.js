const { Schema, model } = require("mongoose");

const robotSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  features: {
    speed: { type: Number, required: true, min: 0, max: 10 },
    resistance: { type: Number, required: true, min: 0, max: 10 },
    yearCreation: { type: Date, required: true, default: Date.now },
  },
});

const Robot = model("robot", robotSchema);

module.exports = Robot;
