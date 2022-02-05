const baseUrl = "/api/movies";
let platforms = [];

window.onload = function () {
  getPlatforms();

  const form = document.forms.addMovie;
  form.onsubmit = function () {
    const requestBody = {
      title: form.title.value,
      director: form.director.value,
      genre: form.genre.value,
      releaseYear: form.releaseYear.value,
      platformIds: getPlatformValues(),
    };

    var xhr = new XMLHttpRequest();

    xhr.open("POST", baseUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (this.status == 201) {
        window.location.replace("/movies/index");
      }
    };

    xhr.send(JSON.stringify(requestBody));
    return false;
  };

  function getPlatformValues() {
    const selectedValues = [];
    const platformElements = form.platforms;
    for (let i = 0; i < platformElements.length; i++) {
      const p = platformElements[i];
      if (p["type"] == "checkbox" && p.checked) {
        selectedValues.push(parseInt(p.value));
      }
    }
    return selectedValues;
  }

  function getPlatforms() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/platforms", true);

    xhr.onload = function () {
      if (this.status == 200) {
        platforms = JSON.parse(xhr.response);
        addCheckboxesForPlatform();
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
        value="${platform.Id}" />
      <label
        class="control-label"
        for="${platform.Name.toLowerCase()}">
          ${platform.Name}
      </label>`;
  }
};
