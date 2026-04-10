var API_KEY = "8eafd0d9";

var searchBtn = document.getElementById("searchBtn");
var inputElement = document.getElementById("searchInput");
var moviesDiv = document.getElementById("movies");
var themeToggle = document.getElementById("themeToggle");
var loadMoreBtn = document.getElementById("loadMoreBtn");

var currentQuery = "";
var currentPageNumber = 1;

function toggleTheme() {
  var bodyElement = document.body;
  if (bodyElement.classList.contains("light-mode")) {
    bodyElement.classList.remove("light-mode");
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  } else {
    bodyElement.classList.add("light-mode");
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "light");
  }
}

function loadTheme() {
  var savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.textContent = "☀️";
  }
}

function startSearch() {
  var query = inputElement.value;
  
  if (query === "") {
    moviesDiv.innerHTML = "<p class='empty'>Please enter a movie name</p>";
    loadMoreBtn.style.display = "none";
    return;
  }
  
  currentQuery = query;
  currentPageNumber = 1;
  moviesDiv.innerHTML = "<p class='empty'>Loading...</p>";
  loadMoreBtn.style.display = "none";
  
  fetchMoviesFromAPI(currentQuery, currentPageNumber);
}

function loadNextPage() {
  currentPageNumber = currentPageNumber + 1;
  fetchMoviesFromAPI(currentQuery, currentPageNumber);
}

function fetchMoviesFromAPI(query, pageNumber) {
  var url = "https://www.omdbapi.com/?s=" + query + "&page=" + pageNumber + "&apikey=" + API_KEY;
  
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.Response === "False") {
        if (pageNumber === 1) {
          moviesDiv.innerHTML = "<p class='empty'>No movies found</p>";
        }
        loadMoreBtn.style.display = "none";
        return;
      }
      
      if (pageNumber === 1) {
        moviesDiv.innerHTML = "";
      }
      
      var moviesArray = data.Search;
      displayMovies(moviesArray);
      
      var totalResults = parseInt(data.totalResults, 10);
      var displayedResults = pageNumber * 10;
      
      if (displayedResults < totalResults) {
        loadMoreBtn.style.display = "block";
      } else {
        loadMoreBtn.style.display = "none";
      }
    })
    .catch(function(error) {
      moviesDiv.innerHTML = "<p class='empty'>Error fetching data</p>";
      loadMoreBtn.style.display = "none";
    });
}

function displayMovies(movies) {
  for (var i = 0; i < movies.length; i = i + 1) {
    var movie = movies[i];
    
    var cardElement = document.createElement("div");
    cardElement.classList.add("card");
    
    var imageElement = document.createElement("img");
    if (movie.Poster !== "N/A") {
      imageElement.setAttribute("src", movie.Poster);
    } else {
      imageElement.setAttribute("src", "");
    }
    
    var titleElement = document.createElement("h3");
    titleElement.textContent = movie.Title;
    
    var yearElement = document.createElement("p");
    yearElement.textContent = movie.Year;
    
    cardElement.appendChild(imageElement);
    cardElement.appendChild(titleElement);
    cardElement.appendChild(yearElement);
    
    moviesDiv.appendChild(cardElement);
  }
}

themeToggle.addEventListener("click", toggleTheme);
searchBtn.addEventListener("click", startSearch);
loadMoreBtn.addEventListener("click", loadNextPage);

inputElement.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    startSearch();
  }
});

function initializePage() {
  loadTheme();
  
  currentQuery = "Avengers";
  currentPageNumber = 1;
  moviesDiv.innerHTML = "<p class='empty'>Loading...</p>";
  
  fetchMoviesFromAPI(currentQuery, currentPageNumber);
}

window.addEventListener("DOMContentLoaded", initializePage);
