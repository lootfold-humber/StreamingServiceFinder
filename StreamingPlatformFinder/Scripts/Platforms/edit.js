const baseUrl = "/api/platforms";
let platformId;

window.onload = function () {
  const splitArr = window.location.toString().split("/");
  platformId = splitArr[splitArr.length - 1];

  const form = document.forms.editPlatform;
  form.onsubmit = function () {
    const requestBody = {
      name: form.name.value,
    };

    var xhr = new XMLHttpRequest();

    xhr.open("PUT", `${baseUrl}/${platformId}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (this.status == 200) {
        window.location.replace("/platforms/index");
      }
    };

    xhr.send(JSON.stringify(requestBody));
    return false;
  };

  getPlatform();

  function addPlatformToPage() {
    const nameTxt = document.querySelector("#name");
    nameTxt.value = platform.Name;
  }

  function getPlatform() {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", `${baseUrl}/${platformId}`, true);

    xhr.onload = function () {
      if (this.status == 200) {
        platform = JSON.parse(xhr.response);
        addPlatformToPage();
      }
    };

    xhr.send();
  }
};
