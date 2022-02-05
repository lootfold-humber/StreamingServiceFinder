const baseUrl = "/api/movies";
let platforms = [];
let movieId;
let movie;

window.onload = function () {
  getPlatforms();

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
        value="${platform.Id}" disabled />
      <label
        class="control-label"
        for="${platform.Name.toLowerCase()}">
          ${platform.Name}
      </label>`;
  }
};
