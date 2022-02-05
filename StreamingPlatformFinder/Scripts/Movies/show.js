const baseUrl = "/api/movies";
let movieId;
let movie;

window.onload = function () {
  const splitArr = window.location.toString().split("/");
  movieId = splitArr[splitArr.length - 1];

  const editBtn = document.querySelector("#btnEdit");
  const deleteBtn = document.querySelector("#btnDelete");

  editBtn.onclick = function () {
    window.location.replace(`/movies/edit/${movieId}`);
  };

  deleteBtn.onclick = function () {
    var xhr = new XMLHttpRequest();

    xhr.open("DELETE", `${baseUrl}/${movieId}`, true);

    xhr.onload = function () {
      if (this.status == 200) {
        window.location.replace(`/movies/index`);
      }
    };

    xhr.send();
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
