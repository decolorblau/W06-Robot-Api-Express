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
    speed: { type: Number, required: true },
    resistance: { type: Number, required: true },
    creation: { type: Date, required: true },
  },
});

const Robot = model("robot", robotSchema);

module.exports = Robot;
