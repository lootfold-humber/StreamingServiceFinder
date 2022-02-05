const baseUrl = "/api/movies";
let platforms = [];
let movieId;

window.onload = function () {
  getPlatforms();

  const splitArr = window.location.toString().split("/");
  movieId = splitArr[splitArr.length - 1];

  const form = document.forms.editMovie;
  form.onsubmit = function () {
    const requestBody = {
      title: form.title.value,
      director: form.director.value,
      genre: form.genre.value,
      releaseYear: form.releaseYear.value,
      platformIds: getPlatformValues(),
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

  function getPlatformValues() {
    const selectedValues = [];
    const platformElements = form.platforms;
    for (let i = 0; i < platformElements.length; i++) {
      const p = platformElements[i];
      if (p["type"] == "checkbox" && p.checked) {
        selectedValues.push(parseInt(p.value));
      }
    }
    return selectedValues;
  }

  function addMovieToPage() {
    const titleTxt = document.querySelector("#title");
    const directorTxt = document.querySelector("#director");
    const genreTxt = document.querySelector("#genre");
    const yearTxt = document.querySelector("#releaseYear");
    const platformsInp = document.querySelectorAll('[name="platforms"]');

    titleTxt.value = movie.Title;
    directorTxt.value = movie.Director;
    genreTxt.value = movie.Genre;
    yearTxt.value = movie.ReleaseYear;

    const platformIds = movie.Platforms.map((p) => p.Id);

    for (let i = 0; i < platformsInp.length; i++) {
      const checkBox = platformsInp[i];
      const checkBoxValue = parseInt(checkBox["value"]);
      if (platformIds.includes(checkBoxValue)) {
        checkBox.checked = true;
      }
    }
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

  function getPlatforms() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/platforms", true);

    xhr.onload = function () {
      if (this.status == 200) {
        platforms = JSON.parse(xhr.response);
        addCheckboxesForPlatform();
        getMovie();
      }
    };
    xhr.send();
  }

  function addCheckboxesForPlatform() {
    const div = document.querySelector("#platforms");
    platforms.forEach((p) => {
      div.innerHTML += createCheckboxForPlatform(p);
    });
  }

  function createCheckboxForPlatform(platform) {
    return `
      <input
        type="checkbox"
        id="${platform.Name.toLowerCase()}"
        name="platforms"
        value="${platform.Id}" />
      <label
        class="control-label"
        for="${platform.Name.toLowerCase()}">
          ${platform.Name}
      </label>`;
  }
};
