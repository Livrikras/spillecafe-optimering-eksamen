"use strict";

// FIND VALGT LOKATION FRA URL
const params = new URLSearchParams(window.location.search);
const selectedLocation = params.get("location");

// ELEMENTER FRA HTML
const gameList = document.getElementById("game-list");
const searchInput = document.getElementById("search-input");

const difficultySelect = document.getElementById("difficulty-select");
const ageSelect = document.getElementById("age-select");
const genreSelect = document.getElementById("genre-select");
const playtimeSelect = document.getElementById("playtime-select");
const playerCountSelect = document.getElementById("player-count-select");

const clearButton = document.getElementById("clear-filters");

const gameCount = document.getElementById("game-count");
const noResults = document.getElementById("no-results");

// LOKATIONER
const locations = {
  Vestergade: {
    title: "Aarhus – Vestergade",
    address: "Vestergade 58A, 8000 Aarhus C",
    image: "../img/location-1.webp",
  },

  Fredensgade: {
    title: "Aarhus – Fredensgade",
    address: "Fredensgade, 8000 Aarhus C",
    image: "../img/location-2.webp",
  },

  Bredgade: {
    title: "Aalborg – Bredgade",
    address: "Bredgade, 9000 Aalborg",
    image: "../img/location-3.webp",
  },

  Slotsgade: {
    title: "Odense – Slotsgade",
    address: "Slotsgade, 5000 Odense C",
    image: "../img/location-4.webp",
  },
};

// FIND ELEMENTER TIL LOKATION
const locationTitle = document.querySelector(".cafe-header h1");
const locationAddress = document.querySelector(".address-bar");
const locationImage = document.querySelector(".cafe-image img");

// OPDATER LOKATION
function updateLocation() {
  // Hvis ingen lokation er valgt
  if (!selectedLocation) {
    console.log("Ingen lokation valgt.");
    return;
  }

  // Find lokationen i vores objekt
  const location = locations[selectedLocation];

  // Hvis lokationen ikke findes
  if (!location) {
    console.log("Ukendt lokation:", selectedLocation);
    return;
  }

  // TITEL
  if (locationTitle) {
    locationTitle.textContent = location.title;
  }

  // ADRESSE
  if (locationAddress) {
    locationAddress.innerHTML = `
      <span class="address-icon">●</span>
      ${location.address}
    `;
  }

  // BILLEDE
  if (locationImage) {
    locationImage.src = location.image;
    locationImage.alt = location.title;
  }
}

updateLocation();

// ALLE SPIL
let allGames = [];

// HENT JSON
fetch("../data/games.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Kunne ikke hente games.json");
    }

    return response.json();
  })

  .then((games) => {
    console.log("Alle spil fra JSON:", games);

    allGames = games;

    applyFilters();

    updateClearButton();
  })

  .catch((error) => {
    console.error("Fejl ved indlæsning af spil:", error);
  });

// VIS SPIL
function displayGames(games) {
  if (!gameList) {
    return;
  }

  // Tøm listen
  gameList.innerHTML = "";

  // Antal spil
  if (gameCount) {
    gameCount.textContent = `${games.length} spil`;
  }

  // Ingen resultater
  if (games.length === 0) {
    if (noResults) {
      noResults.classList.add("show");
    }

    gameList.innerHTML = `
      <p class="no-games">
        Der blev ikke fundet nogen spil.
      </p>
    `;

    return;
  }

  // Fjern "ingen resultater"
  if (noResults) {
    noResults.classList.remove("show");
  }

  // Opret kort
  games.forEach((game) => {
    const card = document.createElement("a");
    // Titlen på spillet på engelsk eller dansk
    const titleLanguage = game.language === "English" ? "en" : "da";

    card.className = "game-card";
    card.href = `spil.html?id=${game.id}`;

    card.innerHTML = `

      <img
        class="game-image"
        src="${game.image}"
        alt="${game.title}"
      >

      <div class="game-info">

        <h3 class="game-title" lang="${titleLanguage}">
          ${game.title}
        </h3>

        <div class="game-tags">

          <span class="tag genre-tag">
            ${game.genre}
          </span>

          <span class="tag difficulty-tag">
            ${game.difficulty}
          </span>

        </div>

        <div class="game-meta">

          <span class="meta-item">

            <span class="meta-icon">
              <img src="../img/person.svg" alt="Antal spillere">
            </span>

            ${game.players.min}-${game.players.max}

          </span>

          <span class="meta-item">

            <span class="meta-icon">
              <img src="../img/time.svg" alt="Spilletid">
            </span>

            ${game.playtime} min

          </span>

        </div>

      </div>

    `;

    gameList.appendChild(card);

    // ÅBN side VED KLIK
    card.addEventListener("click", () => {
      window.location.href = `spil.html?id=${game.id}`;
    });
  });
}

// FILTER
function applyFilters() {
  const search = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const difficulty = difficultySelect ? difficultySelect.value : "all";

  const age = ageSelect ? ageSelect.value : "all";

  const genre = genreSelect ? genreSelect.value : "all";

  const playtime = playtimeSelect ? playtimeSelect.value : "all";

  const playerCount = playerCountSelect ? playerCountSelect.value : "all";

  // FILTRER SPIL
  const filteredGames = allGames.filter((game) => {
    // LOKATION
    const locationMatch =
      !selectedLocation || game.location === selectedLocation;

    // SØGNING
    const searchMatch = game.title.toLowerCase().includes(search);

    // SVÆRHEDSGRAD
    const difficultyMatch =
      difficulty === "all" || game.difficulty === difficulty;

    // ALDER
    const ageMatch = age === "all" || game.age <= Number(age);

    // GENRE
    const genreMatch = genre === "all" || game.genre === genre;

    // SPILLETID
    const playtimeMatch =
      playtime === "all" || game.playtime >= Number(playtime);

    // ANTAL SPILLERE
    let playerMatch = true;

    if (playerCount !== "all") {
      const selectedPlayers = Number(playerCount);

      // 5+ spillere
      if (selectedPlayers === 5) {
        playerMatch = game.players.max >= 5;
      }

      // 1-4 spillere
      else {
        playerMatch =
          game.players.min <= selectedPlayers &&
          game.players.max >= selectedPlayers;
      }
    }

    // ALLE FILTRE
    return (
      locationMatch &&
      searchMatch &&
      difficultyMatch &&
      ageMatch &&
      genreMatch &&
      playtimeMatch &&
      playerMatch
    );
  });

  console.log("Valgt lokation:", selectedLocation);

  console.log("Filtrerede spil:", filteredGames);

  displayGames(filteredGames);
}

// RYD FILTRE KNAP
function updateClearButton() {
  if (!clearButton) {
    return;
  }

  const hasFilter =
    (difficultySelect && difficultySelect.value !== "all") ||
    (ageSelect && ageSelect.value !== "all") ||
    (genreSelect && genreSelect.value !== "all") ||
    (playtimeSelect && playtimeSelect.value !== "all") ||
    (playerCountSelect && playerCountSelect.value !== "all") ||
    (searchInput && searchInput.value.trim() !== "");

  clearButton.classList.toggle("show", hasFilter);
}

// EVENT LISTENERS
if (searchInput) {
  searchInput.addEventListener("input", () => {
    applyFilters();
    updateClearButton();
  });
}

if (difficultySelect) {
  difficultySelect.addEventListener("change", () => {
    applyFilters();
    updateClearButton();
  });
}

if (ageSelect) {
  ageSelect.addEventListener("change", () => {
    applyFilters();
    updateClearButton();
  });
}

if (genreSelect) {
  genreSelect.addEventListener("change", () => {
    applyFilters();
    updateClearButton();
  });
}

if (playtimeSelect) {
  playtimeSelect.addEventListener("change", () => {
    applyFilters();
    updateClearButton();
  });
}

if (playerCountSelect) {
  playerCountSelect.addEventListener("change", () => {
    applyFilters();
    updateClearButton();
  });
}

// RYD ALLE FILTRE
if (clearButton) {
  clearButton.addEventListener("click", () => {
    if (searchInput) {
      searchInput.value = "";
    }

    if (difficultySelect) {
      difficultySelect.value = "all";
    }

    if (ageSelect) {
      ageSelect.value = "all";
    }

    if (genreSelect) {
      genreSelect.value = "all";
    }

    if (playtimeSelect) {
      playtimeSelect.value = "all";
    }

    if (playerCountSelect) {
      playerCountSelect.value = "all";
    }

    applyFilters();

    updateClearButton();
  });
}

updateClearButton();
