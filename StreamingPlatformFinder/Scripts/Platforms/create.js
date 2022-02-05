const baseUrl = "/api/platforms";

window.onload = function () {
  const form = document.forms.addPlatform;
  form.onsubmit = function () {
    const requestBody = {
      name: form.name.value,
    };

    var xhr = new XMLHttpRequest();

    xhr.open("POST", baseUrl, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function () {
      if (this.status == 201) {
        window.location.replace("/platforms/index");
      }
    };

    xhr.send(JSON.stringify(requestBody));
    return false;
  };
};
