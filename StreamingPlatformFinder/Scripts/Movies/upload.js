let uploadForm;
let movieId;

window.onload = handleLoad;

function handleLoad() {
  const splitArr = window.location.toString().split("/");
  movieId = splitArr[splitArr.length - 1];

  uploadForm = document.querySelector("#uploadPoster");
  uploadForm.onsubmit = handleUpload;
}

// https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
function handleUpload() {
  const formData = new FormData(uploadForm);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `/api/movies/${movieId}/upload`, true);
  xhr.onload = function () {
    if (this.status == 200) {
      console.log("done");
      window.location.replace(`/movies/show/${movieId}`);
    }
  };
  xhr.send(formData);

  return false;
}
