document.addEventListener('DOMContentLoaded', function() {
    const catchProbability = 0.3; // Fixed catch probability
  
    const team = []; // Array to store the caught Pokémon
    const teamLimit = 6; // Maximum number of Pokémon in the team
  
    const pokemonIdInput = document.getElementById('pokemonId');
    const messageText = document.querySelector('.message');
    const teamList = document.getElementById('teamList');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmCatchButton = document.getElementById('confirmCatchButton');
    const cancelCatchButton = document.getElementById('cancelCatchButton');
  
    let tries = 20; // Maximum number of tries (Pokeballs)
  
    catchButton.addEventListener('click', function() {
      const pokemonId = parseInt(pokemonIdInput.value);
  
      if (isNaN(pokemonId)) {
        showMessage('Invalid Pokémon ID. Please enter a numeric value.');
        return;
      }
  
      getPokemonData(pokemonId)
  .then(pokemonData => {
    tryToCatchPokemon(pokemonData.name, pokemonData.types, pokemonData.sprite);
  })
  .catch(error => {
    console.error('Error:', error);
  });

    });
  
    confirmCatchButton.addEventListener('click', function() {
      confirmationModal.style.display = 'none';
      const pokemonId = parseInt(pokemonIdInput.value);
      getPokemonName(pokemonId)
        .then(pokemonName => {
          tryToCatchPokemon(pokemonName);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
  
    cancelCatchButton.addEventListener('click', function() {
      confirmationModal.style.display = 'none';
      showMessage('You decided not to catch the Pokémon.');
    });
  
    function tryToCatchPokemon(pokemonName, types, sprite) {
        let caught = false;
      
        while (tries > 0 && !caught) {
          const isSuccess = Math.random() <= catchProbability;
      
          if (isSuccess && team.length < teamLimit) {
            team.push({ name: pokemonName, types: types, sprite: sprite });
            showMessage(`Congratulations! You caught ${pokemonName} and added it to your team.`);
            caught = true;
          } else if (!isSuccess) {
            showMessage(`Oh no! ${pokemonName} broke free.`);
          } else {
            showMessage(`Your team is already full. You cannot catch more Pokémon.`);
          }
      
          tries--;
        }
  
      if (tries === 0 && !caught) {
        showMessage('You ran out of Pokeballs. The Pokémon got away.');
      }
  
      displayTeamMembers();
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
        teamList.innerHTML = ''; // Clear the team list
  
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
      
      
      
      
      
      
  });
  