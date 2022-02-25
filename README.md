# Things covered as part of MVP

- DB connection using entity framework
- constraints on columns using data annotations
- data controller for CRUD (movies & platforms) operations with standard HTTP response codes
- MVC controller & Views for list, show, add & edit pages for movies & platforms
- all api calls are made using AJAX
- page contents are dynamically updates using JS
- pagination in the movies list page
- search box in movies list page (results will filter as the user types in the search box, min 3 characters)
- client side validations for add/edit forms
- server side validations for add/edit forms
- server side check for duplicate values
- styling using bootstrap

# Changes after MVP feedback

- feature to upload movie posters
- display list of movies for a streaming platform
- redesign show page for both movie and streaming platforms
- show alerts for error messages

# Movies

## Index page

- display all movies
- prev & next button for pagination
- search box for searching movie titles (min 3 character)
- display a link to add new movie

## Show movie

- display movie details in disabled controls
  - title
  - director
  - genre
  - year
  - streaming platform (checkboxes)
- edit button: navigates to edit page
- delete button: deletes the movie

## Add movie

- display a form to add movie
  - title (required)
  - director (required)
  - genre (required)
  - year (required)
  - streaming platform
- does not allow duplicate with same name, director & year

## Edit Movie

- same as add movie page

## Api

### GET /api/movies

- returns all movies as paged result
- optional pagination query params
  - pageNo
  - pageSize: no of movies per page
  - searchKey: searches movie titles
- returns empty array if there are no movies in th DB

### GET /api/movies/{id}

- returns movie for provided id
- returns `not found` if movie is not in the DB

### POST /api/movies

- adds new movie to the database
- returns `bad request` for missing fields
- reutrns `bad request` for duplicate movie

### PUT /api/movies/{id}

- updates movie with provided id
- returns `bad request` for missing fields
- reutrns `bad request` for duplicate movie

### Delete /api/movies/{id}

- deletes movie for provided id
- returns `not found` if movie is not in the DB

# Platforms

## Index page

- display all platforms
- display a link to add new platform

## Show platform

- display platform details in disabled controls
  - name
- edit button: navigates to edit page
- delete button: deletes the platform

## Add platform

- display a form to add new platform
  - name (required)
- does not allow duplicate with same name

## Edit platform

- same as add platform page

## Api

### GET /api/platform

- returns all platforms
- returns empty array if there are no platforms in th DB

### GET /api/platform/{id}

- returns platform for provided id
- returns `not found` if platform is not in the DB

### POST /api/platform

- adds new platform to the database
- returns `bad request` for missing fields
- reutrns `bad request` for duplicate platform

### PUT /api/platform/{id}

- updates platform with provided id
- returns `bad request` for missing fields
- reutrns `bad request` for duplicate platform

### Delete /api/platform/{id}

- deletes platform for provided id
- returns `not found` if platform is not in the DB
