const baseUrl = "/api/platforms";
let platformId;
let platform;

window.onload = function () {
  const splitArr = window.location.toString().split("/");
  platformId = splitArr[splitArr.length - 1];

  const editBtn = document.querySelector("#btnEdit");
  const deleteBtn = document.querySelector("#btnDelete");

  editBtn.onclick = function () {
    window.location.replace(`/platforms/edit/${platformId}`);
  };

  deleteBtn.onclick = function () {
    var xhr = new XMLHttpRequest();

    xhr.open("DELETE", `${baseUrl}/${platformId}`, true);

    xhr.onload = function () {
      if (this.status == 200) {
        window.location.replace(`/platforms/index`);
      }
    };

    xhr.send();
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
