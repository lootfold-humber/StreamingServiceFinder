let platformId;
let editForm;

window.onload = handleLoad;

function handleLoad() {
  const splitArr = window.location.toString().split("/");
  platformId = splitArr[splitArr.length - 1];

  editForm = document.forms.editPlatform;
  editForm.onsubmit = handleSubmit;

  getPlatform();
}

function getPlatform() {
  var xhr = new XMLHttpRequest();

  xhr.open("GET", `/api/platforms/${platformId}`, true);

  xhr.onload = function () {
    if (this.status == 200) {
      platformToShow = JSON.parse(xhr.response);
      addPlatformToPage();
    } else {
      var res = JSON.parse(xhr.response);
      alert(res.Message || "Unexpected error occured.");
    }
  };

  xhr.send();
}

function addPlatformToPage() {
  const nameTxt = document.querySelector("#name");
  nameTxt.value = platformToShow.Name;
}

function handleSubmit() {
  const requestBody = {
    name: editForm.name.value,
  };

  var xhr = new XMLHttpRequest();

  xhr.open("PUT", `/api/platforms/${platformId}`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (this.status == 200) {
      window.location.replace("/platforms/index");
    } else {
      var res = JSON.parse(xhr.response);
      alert(res.Message || "Unexpected error occured.");
    }
  };

  xhr.send(JSON.stringify(requestBody));
  return false;
}
