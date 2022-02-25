let movieId;
let platforms = [];
let editForm;
let movieToEdit;

window.onload = handleLoad;

function handleLoad() {
  const splitArr = window.location.toString().split("/");
  movieId = splitArr[splitArr.length - 1];

  getAllPlatforms();

  editForm = document.forms.editMovie;
  editForm.onsubmit = handleEditFormSubmit;
}

function getAllPlatforms() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/platforms", true);

  xhr.onload = function () {
    if (this.status == 200) {
      allPlatforms = JSON.parse(xhr.response);
      addCheckboxesForPlatform();
      getMovieToEdit();
    } else {
      var res = JSON.parse(xhr.response);
      alert(res.Message || "Unexpected error occured.");
    }
  };
  xhr.send();
}

function addCheckboxesForPlatform() {
  const div = document.querySelector("#platforms");
  allPlatforms.forEach((p) => {
    div.innerHTML += createCheckboxInpForPlatform(p);
  });
}

function createCheckboxInpForPlatform(platform) {
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

function getMovieToEdit() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", `/api/movies/${movieId}`, true);
  xhr.onload = function () {
    if (this.status == 200) {
      movieToEdit = JSON.parse(xhr.response);
      addMovieDetailsToPage();
    } else {
      var res = JSON.parse(xhr.response);
      alert(res.Message || "Unexpected error occured.");
    }
  };
  xhr.send();
}

function addMovieDetailsToPage() {
  const titleTxt = document.querySelector("#title");
  const directorTxt = document.querySelector("#director");
  const genreTxt = document.querySelector("#genre");
  const yearTxt = document.querySelector("#releaseYear");
  const platformsInp = document.querySelectorAll('[name="platforms"]');

  titleTxt.value = movieToEdit.Title;
  directorTxt.value = movieToEdit.Director;
  genreTxt.value = movieToEdit.Genre;
  yearTxt.value = movieToEdit.ReleaseYear;

  const platformIds = movieToEdit.Platforms.map((p) => p.Id);

  for (let i = 0; i < platformsInp.length; i++) {
    const checkBox = platformsInp[i];
    const checkBoxValue = parseInt(checkBox["value"]);
    if (platformIds.includes(checkBoxValue)) {
      checkBox.checked = true;
    }
  }
}

function handleEditFormSubmit() {
  const requestBody = {
    title: editForm.title.value,
    director: editForm.director.value,
    genre: editForm.genre.value,
    releaseYear: editForm.releaseYear.value,
    platformIds: getSelectedPlatformsFromEditForm(),
  };

  var xhr = new XMLHttpRequest();

  xhr.open("PUT", `/api/movies/${movieId}`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (this.status == 200) {
      window.location.replace("/movies/index");
    } else {
      var res = JSON.parse(xhr.response);
      alert(res.Message || "Unexpected error occured.");
    }
  };

  xhr.send(JSON.stringify(requestBody));
  return false;
}

function getSelectedPlatformsFromEditForm() {
  const selectedValues = [];
  const platformInputs = document.querySelectorAll('[name="platforms"]');
  for (let i = 0; i < platformInputs.length; i++) {
    const inp = platformInputs[i];
    const inpValue = parseInt(inp.value);
    if (inp.checked) {
      selectedValues.push(inpValue);
    }
  }
  return selectedValues;
}
