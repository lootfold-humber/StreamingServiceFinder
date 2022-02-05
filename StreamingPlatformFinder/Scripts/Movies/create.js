let allPlatforms = [];
let addForm;

window.onload = handleLoad;

function handleLoad() {
  getAllPlatforms();

  addForm = document.forms.addMovie;
  addForm.onsubmit = handleAddFormSubmit;
}

function getAllPlatforms() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/platforms", true);
  xhr.onload = function () {
    if (this.status == 200) {
      allPlatforms = JSON.parse(xhr.response);
      addCheckboxesForPlatform();
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
      value="${platform.Id}" />
    <label
      class="control-label"
      for="${platform.Name.toLowerCase()}">
        ${platform.Name}
    </label>`;
}

function handleAddFormSubmit() {
  const requestBody = {
    title: addForm.title.value,
    director: addForm.director.value,
    genre: addForm.genre.value,
    releaseYear: addForm.releaseYear.value,
    platformIds: getPlatformValuesFromAddForm(),
  };

  var xhr = new XMLHttpRequest();

  xhr.open("POST", "/api/movies", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (this.status == 201) {
      window.location.replace("/movies/index");
    }
  };
  xhr.send(JSON.stringify(requestBody));

  return false;
}

function getPlatformValuesFromAddForm() {
  const selectedValues = [];
  const platformElements = addForm.platforms;
  for (let i = 0; i < platformElements.length; i++) {
    const p = platformElements[i];
    if (p["type"] == "checkbox" && p.checked) {
      selectedValues.push(parseInt(p.value));
    }
  }
  return selectedValues;
}
