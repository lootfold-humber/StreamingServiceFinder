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
    }
  };

  xhr.send();
}

function addPlatformToPage() {
  const nameTxt = document.querySelector("#name");
  nameTxt.value = platformToShow.Name;
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
    }
  };

  xhr.send();
}
