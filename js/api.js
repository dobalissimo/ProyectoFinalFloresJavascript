document.addEventListener('DOMContentLoaded', function() {
  const catchProbability = {
    pokeball: 0.3,
    greatBall: 0.5,
    ultraBall: 0.7,
    masterBall: 1.0, 
  };

  const team = JSON.parse(localStorage.getItem('team')) || []; 
  const teamLimit = 6; 

  const pokemonIdInput = document.getElementById('pokemonId');
  const messageText = document.querySelector('.message');
  const teamList = document.getElementById('teamList');
  const pokeballsLeftText = document.querySelector('.pokeballs-left');

  let pokeballsLeft = parseInt(localStorage.getItem('pokeballsLeft')) || 10; 
  let greatBallsLeft = parseInt(localStorage.getItem('greatBallsLeft')) || 5; 
  let ultraBallsLeft = parseInt(localStorage.getItem('ultraBallsLeft')) || 2; 
  let masterBallsLeft = parseInt(localStorage.getItem('masterBallsLeft')) || 1; 

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
      showMessage('Debés ingresar un valor numérico menor a 1008 (por el momento).');
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
      showMessage(`Te quedaste sin ${ballType === 'pokeball' ? 'Pokéballs' : ballType}! Visita la tienda más cercana para comprar más.`);
    }
  }

  function showConfirmationModal(pokemonName, ballType) {
    Swal.fire({
      title: 'Confirmación:',
      text: `Seguro que querés atrapar a ${capitalizeFirstLetter(pokemonName)} con una ${ballType}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
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
        showMessage('Decidiste no atrapar al pokemon.');
      }
    });
  }

  const resetButton = document.getElementById('resetButton');
  resetButton.addEventListener('click', function() {
    resetTeamAndPokeballs();
  });

  function resetTeamAndPokeballs() {
    team.length = 0; 
    pokeballsLeft = 10; 
    greatBallsLeft = 5; 
    ultraBallsLeft = 2; 
    masterBallsLeft = 1; 

    saveTeamAndPokeballs(); 

    showMessage('Se reseteó el equipo y tus intentos restantes.'); 

    displayTeamMembers(); 
    updatePokeballsLeftText(); 
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
        team.push({ name: capitalizeFirstLetter(pokemonName), types: types, sprite: sprite });
        showMessage(`Fekucutacuibes! Atrapaste a ${capitalizeFirstLetter(pokemonName)} y lo agregaste a tu equipo con una ${ballType}.`);
      } else if (isSuccess && team.length >= teamLimit) {
        showMessage(`Tu equipo está lleno..`);
      } else {
        showMessage(`Oh no! ${capitalizeFirstLetter(pokemonName)} se escapó de tu ${ballType}.`);
      }

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
        showMessage('Te quedaste sin ningún tipo de pokebolas, debes comprar más.');
      }

      saveTeamAndPokeballs(); 

      displayTeamMembers();
    } else {
      showMessage(`Te quedaste sin ${ballType === 'pokeball' ? 'Pokéballs' : ballType}. Comprá más en tu tienda más cercana.`);
    }
  }

  function updatePokeballsLeftText() {
    pokeballsLeftText.textContent = `Pokébolas restantes: ${pokeballsLeft}, Great Balls restantes: ${greatBallsLeft}, Ultra Balls restantes: ${ultraBallsLeft}, Master Balls restantes: ${masterBallsLeft}`;
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
    teamList.innerHTML = ''; 

    if (team.length === 0) {
      return; 
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
      pokemonName.textContent = capitalizeFirstLetter(pokemon.name);
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
    localStorage.setItem('team', JSON.stringify(team)); 
    localStorage.setItem('pokeballsLeft', pokeballsLeft.toString()); 
    localStorage.setItem('greatBallsLeft', greatBallsLeft.toString()); 
    localStorage.setItem('ultraBallsLeft', ultraBallsLeft.toString()); 
    localStorage.setItem('masterBallsLeft', masterBallsLeft.toString()); 
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  updatePokeballsLeftText();
  displayTeamMembers();
});
