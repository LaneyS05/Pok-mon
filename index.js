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

async function main() {
  console.log("START");
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
  console.log(data);

  const end = performance.now();
  const timeToComplete = end - start;
  console.log("complete", timeToComplete);
}

main();
