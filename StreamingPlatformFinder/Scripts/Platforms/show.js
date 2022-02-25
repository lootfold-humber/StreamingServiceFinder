let platformId;
let platformToShow;
let editBtn;
let deleteBtn;

window.onload = handleLoad;

function handleLoad() {
  const splitArr = window.location.toString().split("/");
  platformId = splitArr[splitArr.length - 1];

  editBtn = document.querySelector("#btnEdit");
  deleteBtn = document.querySelector("#btnDelete");

  editBtn.onclick = handleEdit;
  deleteBtn.onclick = handleDelete;

  getPlatform();
}

function getPlatform() {
  var xhr = new XMLHttpRequest();

  xhr.open("GET", `/api/platforms/${platformId}`, true);

  xhr.onload = function () {
    if (this.status == 200) {
      platformToShow = JSON.parse(xhr.response);
      addPlatformToPage();
      addMoviesToPage();
    } else {
      var res = JSON.parse(xhr.response);
      alert(res.Message || "Unexpected error occured.");
    }
  };

  xhr.send();
}

function addPlatformToPage() {
  const nameEl = document.querySelector("#platformName");
  nameEl.innerHTML = platformToShow.Name;
}

function addMoviesToPage() {
  const ulEl = document.querySelector("#moviesList");
  ulEl.innerHTML = "";
  platformToShow.Movies.forEach((m) => {
    ulEl.innerHTML += `<a href="/movies/show/${m.Id}"><li>${m.Title}</li></a>`;
  });
}

function handleEdit() {
  window.location.replace(`/platforms/edit/${platformId}`);
}

function handleDelete() {
  var xhr = new XMLHttpRequest();

  xhr.open("DELETE", `/api/platforms/${platformId}`, true);

  xhr.onload = function () {
    if (this.status == 200) {
      window.location.replace(`/platforms/index`);
    } else {
      var res = JSON.parse(xhr.response);
      alert(res.Message || "Unexpected error occured.");
    }
  };

  xhr.send();
}
