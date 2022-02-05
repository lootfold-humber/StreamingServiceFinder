const baseUrl = "/api/movies";

window.onload = function () {
  const form = document.forms.addMovie;
  form.onsubmit = function () {
    const requestBody = {
      title: form.title.value,
      director: form.director.value,
      genre: form.genre.value,
      releaseYear: form.releaseYear.value,
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
};
