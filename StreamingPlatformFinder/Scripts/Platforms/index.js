let platforms = [];

window.onload = handleLoad;

function handleLoad() {
  getPlatforms();
}

function getPlatforms() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/platforms", true);

  xhr.onload = function () {
    if (this.status == 200) {
      platforms = JSON.parse(xhr.response);
      clearUl();
      updateUl();
    }
  };
  xhr.send();
}

function clearUl() {
  const ul = document.querySelector("#platformList");
  ul.innerHTML = "";
}

function updateUl() {
  const ul = document.querySelector("#platformList");
  platforms.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="/platforms/show/${p.Id}">${p.Name}</a>`;
    ul.appendChild(li);
  });
}
