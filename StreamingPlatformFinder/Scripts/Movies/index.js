let movies = [];
let pageNo = 1;
let pageSize = 10;
let totalPages = 0;
let searchKey = null;

let searchBox;
let prevBtn;
let nextBtn;

window.onload = handleLoad;

function handleLoad() {
  searchBox = document.querySelector("#searchBox");
  prevBtn = document.querySelector("#btnPrev");
  nextBtn = document.querySelector("#btnNext");

  searchBox.onkeyup = searchMovie;
  prevBtn.onclick = prevPage;
  nextBtn.onclick = nextPage;

  getAllMovies();
  updatePrevBtnState();
  updateNextBtnState();
}

function getAllMovies() {
  var xhr = new XMLHttpRequest();

  let url = `/api/movies?pageNo=${pageNo}&pageSize=${pageSize}`;
  if (searchKey) url += `&searchKey=${searchKey}`;

  xhr.open("GET", url, true);

  xhr.onload = function () {
    if (this.status == 200) {
      const response = JSON.parse(xhr.response);
      movies = response.Movies;
      totalPages = Math.ceil(response.Count / pageSize);
      clearTbody();
      updateTbody();
      updatePrevBtnState();
      updateNextBtnState();
    } else {
      var res = JSON.parse(xhr.response);
      alert(res.Message || "Unexpected error occured.");
    }
  };

  xhr.send();
}

function clearTbody() {
  const tableBody = document.querySelector("#movieTable tbody");
  tableBody.innerHTML = "";
}

function updateTbody() {
  const tableBody = document.querySelector("#movieTable tbody");
  movies.forEach((movie) => {
    const tr = createNewTr(movie);
    tableBody.appendChild(tr);
  });
}

function createNewTr(movie) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>
      <a href="/movies/show/${movie.Id}">${movie.Title}</a>
    </td>
    <td>${movie.Director}</td>
    <td>${movie.Genre}</td>
    <td>${movie.ReleaseYear}</td>`;

  return tr;
}

function searchMovie() {
  if (searchBox.value.length >= 3) {
    searchKey = searchBox.value;
    getAllMovies();
  }

  if (searchBox.value.length < 3 && searchKey != null) {
    searchKey = null;
    getAllMovies();
  }
}

function prevPage() {
  pageNo--;
  getAllMovies();
}

function nextPage() {
  pageNo++;
  getAllMovies();
}

function updatePrevBtnState() {
  if (pageNo === 1) disableBtn(prevBtn);
  else enableBtn(prevBtn);
}

function updateNextBtnState() {
  if (pageNo === totalPages) disableBtn(nextBtn);
  else enableBtn(nextBtn);
}

function disableBtn(btn) {
  btn.disabled = true;
}

function enableBtn(btn) {
  btn.disabled = false;
}
