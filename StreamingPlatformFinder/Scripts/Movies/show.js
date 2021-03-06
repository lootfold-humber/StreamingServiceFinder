let allPlatforms = [];
let movieId;
let movieToShow;

let editBtn;
let deleteBtn;
let uploadBtn;

window.onload = handleLoad;

function handleLoad() {
  const splitArr = window.location.toString().split("/");
  movieId = splitArr[splitArr.length - 1];

  editBtn = document.querySelector("#btnEdit");
  deleteBtn = document.querySelector("#btnDelete");
  uploadBtn = document.querySelector("#btnUpload");

  editBtn.onclick = handleEdit;
  deleteBtn.onclick = handleDelete;
  uploadBtn.onclick = handleUpload;

  getAllPlatforms();
}

function getAllPlatforms() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/platforms", true);

  xhr.onload = function () {
    if (this.status == 200) {
      allPlatforms = JSON.parse(xhr.response);
      addCheckboxesForPlatform();
      getMovieToShow();
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

function getMovieToShow() {
  var xhr = new XMLHttpRequest();

  xhr.open("GET", `/api/movies/${movieId}`, true);

  xhr.onload = function () {
    if (this.status == 200) {
      movieToShow = JSON.parse(xhr.response);
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
  const imageEl = document.querySelector("#moviePoster");

  titleTxt.innerHTML = movieToShow.Title;
  directorTxt.innerHTML = movieToShow.Director;
  genreTxt.innerHTML = movieToShow.Genre;
  yearTxt.innerHTML = movieToShow.ReleaseYear;

  if (movieToShow.FileName != null) {
    imageEl.src = `/Content/Images/${movieToShow.FileName}`;
  } else {
    imageEl.style.display = "none";
  }

  const platformIds = movieToShow.Platforms.map((p) => p.Id);

  for (let i = 0; i < platformsInp.length; i++) {
    const checkBox = platformsInp[i];
    const checkBoxValue = parseInt(checkBox["value"]);
    if (platformIds.includes(checkBoxValue)) {
      checkBox.checked = true;
    }
  }
}

function handleEdit() {
  window.location.replace(`/movies/edit/${movieId}`);
}

function handleUpload() {
  window.location.replace(`/movies/upload/${movieId}`);
}

function handleDelete() {
  var xhr = new XMLHttpRequest();

  xhr.open("DELETE", `/api/movies/${movieId}`, true);

  xhr.onload = function () {
    if (this.status == 200) {
      window.location.replace(`/movies/index`);
    } else {
      var res = JSON.parse(xhr.response);
      alert(res.Message || "Unexpected error occured.");
    }
  };

  xhr.send();
}
