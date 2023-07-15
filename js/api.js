document.addEventListener('DOMContentLoaded', function() {
    const catchProbability = 0.3; // Probabilidad de atrapar
  
    const team = JSON.parse(localStorage.getItem('team')) || []; // Obtener el equipo del localStorage
    const teamLimit = 6; // Número máximo de Pokémon en el equipo
  
    const pokemonIdInput = document.getElementById('pokemonId');
    const messageText = document.querySelector('.message');
    const teamList = document.getElementById('teamList');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmCatchButton = document.getElementById('confirmCatchButton');
    const cancelCatchButton = document.getElementById('cancelCatchButton');
    
    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', function() {
      resetTeamAndPokeballs();
    });

  
    const pokeballsLeftText = document.querySelector('.pokeballs-left');
  
    let tries = 20; // Número máximo de intentos (Pokeballs)
    const pokeballPrice = 200; // Precio de cada Pokéball
    let pokeballsLeft = parseInt(localStorage.getItem('pokeballsLeft')) || tries; // Obtener las Pokébolas restantes del localStorage
  
    const catchButton = document.getElementById('catchButton');
    catchButton.addEventListener('click', function() {
      const pokemonId = parseInt(pokemonIdInput.value);
  
      if (isNaN(pokemonId)) {
        showMessage('ID de Pokémon no válido. Por favor, introduce un valor numérico.');
        return;
      }
  
      if (pokeballsLeft > 0) {
        getPokemonData(pokemonId)
          .then(pokemonData => {
            showConfirmationModal(pokemonData.name);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else {
        showMessage(`Te has quedado sin Pokéballs. Visita la tienda más cercana para conseguir más por ${pokeballPrice}$ cada una.`);
      }
    });
  
    confirmCatchButton.addEventListener('click', function() {
      confirmationModal.style.display = 'none';
      const pokemonId = parseInt(pokemonIdInput.value);
      getPokemonData(pokemonId)
        .then(pokemonData => {
          tryToCatchPokemon(pokemonData.name, pokemonData.types, pokemonData.sprite);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
  
    cancelCatchButton.addEventListener('click', function() {
      confirmationModal.style.display = 'none';
      showMessage('Decidiste no atrapar al Pokémon.');
    });
  
    function showConfirmationModal(pokemonName) {
      const modalMessage = document.querySelector('.modal-message');
      modalMessage.textContent = `¿Estás seguro de que quieres atrapar a ${pokemonName}?`;
      confirmationModal.style.display = 'block';
    }

    function resetTeamAndPokeballs() {
        team.length = 0; // Vaciar el equipo
        pokeballsLeft = tries; // Restablecer las Pokébolas restantes
        
        saveTeamAndPokeballs(); // Guardar los cambios en el localStorage
      
        showMessage('El equipo y los intentos han sido reseteados.'); // Mostrar un mensaje de confirmación
      
        displayTeamMembers(); // Actualizar la visualización del equipo
        updatePokeballsLeftText(); // Actualizar el texto de las Pokébolas restantes
      }
      
  
    function tryToCatchPokemon(pokemonName, types, sprite) {
      if (pokeballsLeft > 0) {
        const isSuccess = Math.random() <= catchProbability;
  
        if (isSuccess && team.length < teamLimit) {
          team.push({ name: pokemonName, types: types, sprite: sprite });
          showMessage(`¡Felicidades! Has atrapado a ${pokemonName} y lo has añadido a tu equipo.`);
        } else if (isSuccess && team.length >= teamLimit) {
          showMessage(`Tu equipo está lleno. No puedes atrapar más Pokémon.`);
        } else {
          showMessage(`¡Oh no! ${pokemonName} se ha escapado.`);
        }
  
        pokeballsLeft--;
        updatePokeballsLeftText();
  
        if (pokeballsLeft === 0) {
          showMessage(`Te has quedado sin Pokéballs. Visita la tienda más cercana para conseguir más por ${pokeballPrice}$ cada una.`);
        }
  
        saveTeamAndPokeballs(); // Guardar el equipo y las Pokébolas restantes en el localStorage
  
        displayTeamMembers();
      } else {
        showMessage(`Te has quedado sin Pokéballs. Visita la tienda más cercana para conseguir más por ${pokeballPrice}$ cada una.`);
      }
    }
  
    function updatePokeballsLeftText() {
      pokeballsLeftText.textContent = `Pokéballs restantes: ${pokeballsLeft}`;
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
    }
  
    updatePokeballsLeftText();
    displayTeamMembers();

  });
  