const { Schema, model } = require("mongoose");

const robotSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  features: {
    speed: { type: Number, min: 0, max: 10 },
    resistance: { type: Number, min: 0, max: 10 },
    yearCreation: { type: String },
  },
});

const Robot = model("robot", robotSchema, "robots");

module.exports = Robot;
