"use strict";

const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");

fetch("../data/games.json")
  .then((response) => response.json())
  .then((games) => {
    const game = games.find((game) => game.id == gameId);

    if (!game) {
      console.log("Spillet blev ikke fundet");
      return;
    }

    const gameTitle = document.querySelector("#game-title");
    gameTitle.textContent = game.title;
    gameTitle.lang = game.language === "English" ? "en" : "da";
    document.querySelector("#game-description").textContent = game.description;
    document.querySelector("#game-genre").textContent = game.genre;
    document.querySelector("#game-players").textContent =
      `${game.players.min}-${game.players.max}`;
    document.querySelector("#game-age").textContent = game.age;
    document.querySelector("#game-difficulty").textContent = game.difficulty;
    document.querySelector("#game-playtime").textContent = game.playtime;
    document.querySelector("#game-image").src = game.image;
    document.querySelector("#game-image").alt = game.name;
    document.querySelector("#game-language").textContent = game.language;
    document.querySelector("#game-rules").textContent = game.rules;
  });

card.innerHTML = `
    <a href="spil.html?id=${game.id}" class="cards">
        <img src="${game.image}" alt="${game.name}">
        <h3>${game.name}</h3>
        <p>${game.genre}</p>
    </a>
`;
