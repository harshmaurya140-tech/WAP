const API_KEY = "CabxRr94GhAAfVYvGce1V8Oog9NhYwAAyxpA0R";

const searchBtn = document.getElementById("searchBtn");
const input = document.getElementById("searchInput");
const moviesDiv = document.getElementById("movies");


searchBtn.addEventListener("click", () => {
  fetchMovies(input.value);
});


input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchMovies(input.value);
  }
});


async function fetchMovies(query) {
  if (!query) {
    moviesDiv.innerHTML = `<p class="empty">Please enter a movie name</p>`;
    return;
  }

  moviesDiv.innerHTML = `<p class="empty">Loading...</p>`;

  try {
    const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
    const data = await res.json();

    if (data.Response === "False") {
      moviesDiv.innerHTML = `<p class="empty">No movies found</p>`;
      return;
    }

    displayMovies(data.Search);

  } catch (error) {
    moviesDiv.innerHTML = `<p class="empty">Error fetching data</p>`;
  }
}


function displayMovies(movies) {
  moviesDiv.innerHTML = "";

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    `;

    moviesDiv.appendChild(card);
  });
}