let addForm;

window.onload = handleLoad;

function handleLoad() {
  addForm = document.forms.addPlatform;
  addForm.onsubmit = handleSubmit;
}

function handleSubmit() {
  const requestBody = {
    name: addForm.name.value,
  };

  var xhr = new XMLHttpRequest();

  xhr.open("POST", "/api/platforms", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (this.status == 201) {
      window.location.replace("/platforms/index");
    } else {
      var res = JSON.parse(xhr.response);
      alert(res.Message || "Unexpected error occured.");
    }
  };

  xhr.send(JSON.stringify(requestBody));
  return false;
}
