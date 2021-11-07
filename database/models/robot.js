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
    yearCreation: { type: String, required: true },
  },
});

const Robot = model("robot", robotSchema);

module.exports = Robot;
