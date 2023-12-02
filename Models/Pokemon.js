const mongoose = require("mongoose");

const PokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  PokemonId: {
    type: Number,
    require: true,
  },
  height: Number,
  weight: Number,
  imageSrc: String,
});

module.exports = mongoose.model("Pokemon", PokemonSchema);
