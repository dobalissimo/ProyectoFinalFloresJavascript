document.addEventListener('DOMContentLoaded', function() {
  const catchProbability = {
    pokeball: 0.3,
    greatBall: 0.5,
    ultraBall: 0.7,
    masterBall: 1.0, // Master Ball always succeeds
  };

  const team = JSON.parse(localStorage.getItem('team')) || []; // Obtener el equipo del localStorage
  const teamLimit = 6; // Número máximo de Pokémon en el equipo

  const pokemonIdInput = document.getElementById('pokemonId');
  const messageText = document.querySelector('.message');
  const teamList = document.getElementById('teamList');
  const pokeballsLeftText = document.querySelector('.pokeballs-left');

  let pokeballsLeft = parseInt(localStorage.getItem('pokeballsLeft')) || 10; // Number of Pokéballs
  let greatBallsLeft = parseInt(localStorage.getItem('greatBallsLeft')) || 5; // Number of Great Balls
  let ultraBallsLeft = parseInt(localStorage.getItem('ultraBallsLeft')) || 2; // Number of Ultra Balls
  let masterBallsLeft = parseInt(localStorage.getItem('masterBallsLeft')) || 1; // Number of Master Balls

  const catchButton = document.getElementById('catchButton');
  catchButton.addEventListener('click', function() {
    throwPokeball('pokeball');
  });

  const greatBallButton = document.getElementById('greatBallButton');
  greatBallButton.addEventListener('click', function() {
    throwPokeball('greatBall');
  });

  const ultraBallButton = document.getElementById('ultraBallButton');
  ultraBallButton.addEventListener('click', function() {
    throwPokeball('ultraBall');
  });

  const masterBallButton = document.getElementById('masterBallButton');
  masterBallButton.addEventListener('click', function() {
    throwPokeball('masterBall');
  });

  function throwPokeball(ballType) {
    const pokemonId = parseInt(pokemonIdInput.value);

    if (isNaN(pokemonId)) {
      showMessage('Invalid Pokémon ID. Please enter a numeric value.');
      return;
    }

    let remainingBalls = 0;

    switch (ballType) {
      case 'pokeball':
        remainingBalls = pokeballsLeft;
        break;
      case 'greatBall':
        remainingBalls = greatBallsLeft;
        break;
      case 'ultraBall':
        remainingBalls = ultraBallsLeft;
        break;
      case 'masterBall':
        remainingBalls = masterBallsLeft;
        break;
      default:
        remainingBalls = 0;
        break;
    }

    if (remainingBalls > 0) {
      getPokemonData(pokemonId)
        .then(pokemonData => {
          showConfirmationModal(pokemonData.name, ballType);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      showMessage(`You ran out of ${ballType === 'pokeball' ? 'Pokéballs' : ballType}! Visit the nearest mart to get more.`);
    }
  }

  function showConfirmationModal(pokemonName, ballType) {
    Swal.fire({
      title: 'Confirmation',
      text: `Are you sure you want to catch ${pokemonName} with a ${ballType}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        const pokemonId = parseInt(pokemonIdInput.value);
        getPokemonData(pokemonId)
          .then(pokemonData => {
            tryToCatchPokemon(pokemonData.name, pokemonData.types, pokemonData.sprite, ballType);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else {
        showMessage('You decided not to catch the Pokémon.');
      }
    });
  }

  const resetButton = document.getElementById('resetButton');
  resetButton.addEventListener('click', function() {
    resetTeamAndPokeballs();
  });

  function resetTeamAndPokeballs() {
    team.length = 0; // Vaciar el equipo
    pokeballsLeft = 10; // Restablecer el número de Pokéballs
    greatBallsLeft = 5; // Restablecer el número de Great Balls
    ultraBallsLeft = 2; // Restablecer el número de Ultra Balls
    masterBallsLeft = 1; // Restablecer el número de Master Balls

    saveTeamAndPokeballs(); // Guardar los cambios en el localStorage

    showMessage('The team and tries have been reset.'); // Mostrar un mensaje de confirmación

    displayTeamMembers(); // Actualizar la visualización del equipo
    updatePokeballsLeftText(); // Actualizar el texto de las Pokébolas restantes
  }

  function tryToCatchPokemon(pokemonName, types, sprite, ballType) {
    let remainingBalls = 0;

    switch (ballType) {
      case 'pokeball':
        remainingBalls = pokeballsLeft;
        break;
      case 'greatBall':
        remainingBalls = greatBallsLeft;
        break;
      case 'ultraBall':
        remainingBalls = ultraBallsLeft;
        break;
      case 'masterBall':
        remainingBalls = masterBallsLeft;
        break;
      default:
        remainingBalls = 0;
        break;
    }

    if (remainingBalls > 0) {
      const isSuccess = Math.random() <= catchProbability[ballType];

      if (isSuccess && team.length < teamLimit) {
        team.push({ name: pokemonName, types: types, sprite: sprite });
        showMessage(`Congratulations! You caught ${pokemonName} and added it to your team with a ${ballType}.`);
      } else if (isSuccess && team.length >= teamLimit) {
        showMessage(`Your team is already full. You cannot catch more Pokémon with a ${ballType}.`);
      } else {
        showMessage(`Oh no! ${pokemonName} broke free from the ${ballType}.`);
      }

      // Deduct the ball used
      switch (ballType) {
        case 'pokeball':
          pokeballsLeft = remainingBalls - 1;
          break;
        case 'greatBall':
          greatBallsLeft = remainingBalls - 1;
          break;
        case 'ultraBall':
          ultraBallsLeft = remainingBalls - 1;
          break;
        case 'masterBall':
          masterBallsLeft = remainingBalls - 1;
          break;
        default:
          break;
      }

      updatePokeballsLeftText();

      if (pokeballsLeft === 0 && greatBallsLeft === 0 && ultraBallsLeft === 0 && masterBallsLeft === 0) {
        showMessage('You ran out of all types of balls. Visit the nearest mart to get more.');
      }

      saveTeamAndPokeballs(); // Guardar el equipo y las Pokébolas restantes en el localStorage

      displayTeamMembers();
    } else {
      showMessage(`You ran out of ${ballType === 'pokeball' ? 'Pokéballs' : ballType}. Visit the nearest mart to get more.`);
    }
  }

  function updatePokeballsLeftText() {
    pokeballsLeftText.textContent = `Pokéballs left: ${pokeballsLeft}, Great Balls left: ${greatBallsLeft}, Ultra Balls left: ${ultraBallsLeft}, Master Balls left: ${masterBallsLeft}`;
  }

  function getPokemonData(pokemonNumber) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`)
      .then(response => response.json())
      .then(data => {
        const pokemonName = data.name;
        const types = data.types.map(typeData => typeData.type.name);
        const sprite = data.sprites.front_default;
        return { name: pokemonName, types: types, sprite: sprite };
      })
      .catch(error => {
        console.error('Error:', error);
        throw error;
      });
  }

  function showMessage(message) {
    messageText.textContent = message;
  }

  function displayTeamMembers() {
    teamList.innerHTML = ''; // Limpiar la lista de equipo

    if (team.length === 0) {
      return; // Salir si el equipo está vacío
    }

    const row = document.createElement('div');
    row.classList.add('row', 'row-cols-1', 'row-cols-md-3', 'g-4', 'card-grid');

    team.forEach(pokemon => {
      const col = document.createElement('div');
      col.classList.add('col');

      const card = document.createElement('div');
      card.classList.add('card', 'h-100');

      pokemon.types.forEach((type, index) => {
        const typeClass = `card-${type.toLowerCase()}-${index + 1}`;
        card.classList.add(typeClass);
      });

      const pokemonSprite = document.createElement('img');
      pokemonSprite.classList.add('card-img-top');
      pokemonSprite.src = pokemon.sprite;
      card.appendChild(pokemonSprite);

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      const pokemonName = document.createElement('h5');
      pokemonName.classList.add('card-title');
      pokemonName.textContent = pokemon.name;
      cardBody.appendChild(pokemonName);

      const pokemonTypes = document.createElement('p');
      pokemonTypes.classList.add('card-text');
      pokemonTypes.textContent = `Types: ${pokemon.types.join(', ')}`;
      cardBody.appendChild(pokemonTypes);

      card.appendChild(cardBody);
      col.appendChild(card);
      row.appendChild(col);
    });

    teamList.appendChild(row);
  }

  function saveTeamAndPokeballs() {
    localStorage.setItem('team', JSON.stringify(team)); // Guardar el equipo en el localStorage
    localStorage.setItem('pokeballsLeft', pokeballsLeft.toString()); // Guardar las Pokébolas restantes en el localStorage
    localStorage.setItem('greatBallsLeft', greatBallsLeft.toString()); // Guardar las Great Balls restantes en el localStorage
    localStorage.setItem('ultraBallsLeft', ultraBallsLeft.toString()); // Guardar las Ultra Balls restantes en el localStorage
    localStorage.setItem('masterBallsLeft', masterBallsLeft.toString()); // Guardar las Master Balls restantes en el localStorage
  }

  updatePokeballsLeftText();
  displayTeamMembers();
});
