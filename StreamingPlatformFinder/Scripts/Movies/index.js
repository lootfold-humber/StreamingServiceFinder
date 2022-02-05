﻿const baseUrl = "/api/movies";
let moviesArray = [];
let pageNo = 1;
let pageSize = 5;
let totalPages = 0;
let searchKey = null;

window.onload = function () {
  const searchBox = document.querySelector("#searchBox");
  const prevBtn = document.querySelector("#btnPrev");
  const nextBtn = document.querySelector("#btnNext");

  searchBox.onkeyup = searchMovie;

  prevBtn.onclick = prevPage;
  nextBtn.onclick = nextPage;

  checkPrevPageBtn();
  checkNextPageBtn();

  getMovies();

  function searchMovie() {
    if (searchBox.value.length >= 3) {
      searchKey = searchBox.value;
      getMovies();
    }

    if (searchBox.value.length < 3 && searchKey != null) {
      searchKey = null;
      getMovies();
    }
  }

  function prevPage() {
    pageNo--;
    getMovies();
    checkPrevPageBtn();
    checkNextPageBtn();
  }

  function nextPage() {
    pageNo++;
    getMovies();
    checkPrevPageBtn();
    checkNextPageBtn();
  }

  function checkPrevPageBtn() {
    if (pageNo === 1) disableBtn(prevBtn);
    else enableBtn(prevBtn);
  }

  function checkNextPageBtn() {
    if (pageNo === totalPages) disableBtn(nextBtn);
    else enableBtn(nextBtn);
  }

  function disableBtn(btn) {
    btn.disabled = true;
  }

  function enableBtn(btn) {
    btn.disabled = false;
  }

  function updateTbody() {
    const tableBody = document.querySelector("#movieTable tbody");
    moviesArray.forEach((movie) => {
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

  function clearTbody() {
    const tableBody = document.querySelector("#movieTable tbody");
    tableBody.innerHTML = "";
  }

  function getMovies() {
    var xhr = new XMLHttpRequest();

    let url = `${baseUrl}?pageNo=${pageNo}&pageSize=${pageSize}`;
    if (searchKey) url += `&searchKey=${searchKey}`;

    xhr.open("GET", url, true);

    xhr.onload = function () {
      if (this.status == 200) {
        const response = JSON.parse(xhr.response);
        moviesArray = response.Movies;
        totalPages = Math.ceil(response.Count / pageSize);
        clearTbody();
        updateTbody();
        checkPrevPageBtn();
        checkNextPageBtn();
      }
    };

    xhr.send();
  }
};