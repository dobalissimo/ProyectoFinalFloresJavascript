// Clase Pokémon
class Pokemon {
  constructor(number, name, level, type) {
    this.number = number;
    this.name = name;
    this.level = level;
    this.type = type;
  }
}

// Array de datos de los Pokémon
const pokemonData = [
  new Pokemon(1, 'Bulbasaur', 5, 'planta y veneno'),
  new Pokemon(2, 'Ivysaur', 16, 'planta y veneno'),
  new Pokemon(3, 'Venusaur', 32, 'planta y veneno'),
  new Pokemon(4, 'Charmander', 5, 'fuego'),
  new Pokemon(5, 'Charmeleon', 16, 'fuego'),
  new Pokemon(6, 'Charizard', 36, 'fuego y volador'),
  new Pokemon(7, 'Squirtle', 5, 'agua'),
  new Pokemon(8, 'Wartortle', 16, 'agua'),
  new Pokemon(9, 'Blastoise', 36, 'agua')
];

function getPokemonName(pokemonNumber) {
  return pokemonData[pokemonNumber - 1].name;
}

function getSelectedPokemon(pokemonNumber) {
  return pokemonData.find(pokemon => pokemon.number === pokemonNumber);
}

function saludarEntrenador(gender, name, townFood, pokemonNumber) {
  const pronoun = gender === 'chico' ? 'entrenador' : gender === 'chica' ? 'entrenadora' : '';
  const greeting = 'Te damos la bienvenida';

  const pokemonName = getPokemonName(pokemonNumber);
  const selectedPokemon = getSelectedPokemon(pokemonNumber);

  if (pronoun) {
    alert(`¡Hola, ${pronoun} ${name} de pueblo ${townFood}! Has elegido a ${pokemonName} (Nivel ${selectedPokemon.level}) de tipo ${selectedPokemon.type}. ¡Mucha suerte en tu aventura!`);
  } else {
    alert(`${greeting}, ${name} de pueblo ${townFood}! Has elegido a ${pokemonName} (Nivel ${selectedPokemon.level}) de tipo ${selectedPokemon.type}. ¡Mucha suerte en tu aventura!`);
  }
}

let boyorgirl = prompt('¿Eres un chico, una chica o prefieres no utilizar un pronombre?').toLowerCase();
let nombre = prompt('¿Cuál es tu nombre?');
let comida = prompt('¿Cuál es tu comida favorita?');

let promptpokemon = 0;
while (promptpokemon < 1 || promptpokemon > 9) {
  userInput = prompt('Elige tu Pokémon utilizando su número, del 1 al 9');

  if (isNaN(userInput)) {
    alert('¡Ingresa un valor numérico!');
  } else {
    promptpokemon = parseInt(userInput);
  }

  if (promptpokemon < 1 || promptpokemon > 9) {
    alert('¡Del 1 al 9 te dije!');
  }
}

let nropokemon = parseInt(promptpokemon);

saludarEntrenador(boyorgirl, nombre, comida, nropokemon);
