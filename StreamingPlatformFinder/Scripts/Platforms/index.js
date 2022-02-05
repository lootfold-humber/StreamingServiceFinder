const baseUrl = "/api/platforms";
let platforms = [];

window.onload = function () {
  getPlatforms();

  function updateUl() {
    const ul = document.querySelector("#platformList");
    platforms.forEach((p) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="/platforms/show/${p.Id}">${p.Name}</a>`;
      ul.appendChild(li);
    });
  }

  function clearUl() {
    const ul = document.querySelector("#platformList");
    ul.innerHTML = "";
  }

  function getPlatforms() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", baseUrl, true);

    xhr.onload = function () {
      if (this.status == 200) {
        platforms = JSON.parse(xhr.response);
        console.log(platforms);
        clearUl();
        updateUl();
      }
    };
    xhr.send();
  }
};
