// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});


$$(document).on('deviceready', function() {
   
    $('#movieForm').on("submit", function(e){
        
        var searchMovie = $('#movieName').val();
        
        fetchMovies(searchMovie);
        console.log(searchMovie);
        
        e.preventDefault();
    });
    
});







function fetchMovies(searchMovie){
    
    $.ajax({
        method: "GET",
        url: "http://www.omdbapi.com/?apikey=6e0711cb&s=" + searchMovie
        
    }).done(function(data){
        console.log(data);

        if(data.Response == "false"){
            myApp.alert('Enter a valid movie name', 'Reminder!');
        }

        var moviesArray = data.Search;
        var moviesList = '';

        $.each(moviesArray, function(index, movie){
            moviesList+= `
            <li>
              <a href="movieInfo.html" class="item-link item-content" onclick="clickedMovie('${movie.imdbID}')">
                 <div class="item-media"><img src="${movie.Poster}" width="80"></div>
                 <div class="item-inner">
                     <div class="item-title-row">
                        <div class="item-title">${movie.Title}</div>
                        <div class="item-after">${movie.Year}</div>
                     </div>
                 </div>
              </a>
            </li>
            `;

            $('#moviesList').html(moviesList);
        });
    });
}

//this logs the imdbID from the onclick function in the movieList and stores it
function clickedMovie(imdbID){
    console.log(imdbID);
    sessionStorage.setItem("movieId", imdbID);
}



myApp.onPageInit('movieInfo', function (page) {

    //retrieving the store information on another page
    var imdbID = sessionStorage.getItem("movieId");

    movieDetails(imdbID);


})

//to display the information on the next page
function movieDetails(imdbID){
    $.ajax({
        method: "GET",
        url: "http://www.omdbapi.com/?apikey=6e0711cb&i=" + imdbID

    }).done(function(response) {
        console.log(response);

        var mDetails = `
                <div class="card demo-card-header-pic">
                    <div class="item-media"><h1 id="mtitle">${response.Title}</h1><img id="poster" src="${response.Poster}"></div>
                    <div class="card-content">
                        <div class="card-content-inner">
                            <p><b>Release Date:</b> ${response.Released}
                            <br><b>Directed by:</b> ${response.Director}
                            <br><b>Actors:</b> ${response.Actors}
                            <br><b>Genre:</b> ${response.Genre}
                            <br><b>Runtime:</b> ${response.Runtime}
                            </p>
                            <p>${response.Plot}</p>
                            <hr>
                            <p><b>Rating from imdb:</b> ${response.imdbRating}/10</p>
                        </div>
                    </div>
                </div>
        `;


        $('#movieinfo').html(mDetails);
    });
}
