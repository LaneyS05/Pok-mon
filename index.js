const mongoose = require("mongoose");
require("dotenv").config();
const Pokemon = require("./Models/Pokemon");

async function getPokemon(url) {
  const response = await fetch(url);
  const data = await response.json();

  return {
    pokemonId: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    imageScr: data.sprites.front_default,
  };
}

async function savePokemon(pokemon) {
  try {
    await Pokemon.insertMany(pokemon);
  } catch (error) {
    console.log("ERROR saving pokemon", error);
  }
}

async function main() {
  console.log("START");

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  await Pokemon.deleteMany();

  const start = performance.now();
  console.log(start);

  let baseURL = "https://pokeapi.co/api/v2/pokemon";
  let pokemonSearch = true;
  const pokemonPromeses = [];
  while (pokemonSearch) {
    const response = await fetch(baseURL);
    const data = await response.json();

    data.results.forEach((result) => {
      pokemonPromeses.push(getPokemon(result.url));
    });
    if (!data.next) {
      pokemonSearch = false;
      baseURL = data.next;
    } else {
      baseURL = data.next;
    }
  }
  const data = await Promise.all(pokemonPromeses);

  const size = 50;
  const pokemonToSave = [];
  for (let i = 0; i < data.length; i += size) {
    pokemonToSave.push(savePokemon(data.slice(i, i + size)));
  }
  await Promise.all(pokemonToSave);

  //console.log(data);

  const end = performance.now();
  const timeToComplete = end - start;
  console.log("complete", timeToComplete);
  process.exit(0);
}

main();
