let uploadForm;
let movieId;

window.onload = handleLoad;

function handleLoad() {
  const splitArr = window.location.toString().split("/");
  movieId = splitArr[splitArr.length - 1];

  uploadForm = document.querySelector("#uploadPoster");
  uploadForm.onsubmit = handleUpload;
}

function handleUpload() {
  const formData = new FormData(uploadForm);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `/api/movies/${movieId}/upload`, true);
  xhr.onload = function () {
    if (this.status == 201) {
      console.log("done");
      //   window.location.replace("/movies/index");
    }
  };
  xhr.send(formData);

  return false;
}
