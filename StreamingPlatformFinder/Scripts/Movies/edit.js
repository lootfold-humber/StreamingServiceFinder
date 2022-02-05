const baseUrl = "/api/movies";
let movieId;

window.onload = function () {
  const splitArr = window.location.toString().split("/");
  movieId = splitArr[splitArr.length - 1];

  const form = document.forms.editMovie;
  form.onsubmit = function () {
    const requestBody = {
      title: form.title.value,
      director: form.director.value,
      genre: form.genre.value,
      releaseYear: form.releaseYear.value,
    };

    var xhr = new XMLHttpRequest();

    xhr.open("PUT", `${baseUrl}/${movieId}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (this.status == 200) {
        window.location.replace("/movies/index");
      }
    };

    xhr.send(JSON.stringify(requestBody));
    return false;
  };

  getMovie();

  function addMovieToPage() {
    const titleTxt = document.querySelector("#title");
    const directorTxt = document.querySelector("#director");
    const genreTxt = document.querySelector("#genre");
    const yearTxt = document.querySelector("#releaseYear");

    titleTxt.value = movie.Title;
    directorTxt.value = movie.Director;
    genreTxt.value = movie.Genre;
    yearTxt.value = movie.ReleaseYear;
  }

  function getMovie() {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${baseUrl}/${movieId}`, true);

    xhr.onload = function () {
      if (this.status == 200) {
        movie = JSON.parse(xhr.response);
        addMovieToPage();
      }
    };

    xhr.send();
  }
};
