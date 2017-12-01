d3.csv("data/movie_metadata.csv", function (error, movies) {
    if (error) throw error;

    window.excelMovies = movies;
    window.allActors = getActors();
    window.allDirectors = getDirectors();
    window.allGenres = getGenres();

    window.selectedYears = [];
    window.selectedRatings = [];
    window.selectedGenres = [];

    //Initialize default values for the actor/director search filter
    updateSearchFilter("actor");

    //Render the plot for the default actor
    window.actorDirectorStats = new ActorDirectorStats("Actor", "Tom Hanks", getMoviesFor("actor", "Tom Hanks"), "imdb_score");
    actorDirectorStats.plot();

    //Render the initial movies table with 10 arbitrary movies
    window.movieTable = new MovieTable(movies.slice(0, 20));
    movieTable.create();
    movieTable.update();

    let nodelinkfd = new NodeLinkFD(movies.slice(0,15));
    nodelinkfd.update();

    //Render the movies filters
    let filters = new Filters(movies);
    filters.create();


    let wordcloud = new WordCloud(movies);
    wordcloud.update();


    let moviesGroupedByRating = d3.nest()
        .key( (d) => { return d["imdb_score"]; } ).sortKeys(d3.ascending)
        .entries(movies);

    let budgetVsRating = new BudgetVsRating(moviesGroupedByRating);
    budgetVsRating.plot();

});




/**
 *  Returns a sorted set of all (unique) actors
 */
function getActors() {

    //Get all actors
    let actor1names = excelMovies.map(d => { if(d["actor_1_name"] && d["actor_1_name"].trim().length > 0) return d["actor_1_name"];});
    let actor2names = excelMovies.map(d => { if(d["actor_2_name"] && d["actor_2_name"].trim().length > 0) return d["actor_2_name"];});
    let actor3names = excelMovies.map(d => { if(d["actor_3_name"] && d["actor_3_name"].trim().length > 0) return d["actor_3_name"];});

    //Merge all actors and sort. Then remove duplicates using set
    let actors_set = new Set(actor1names.concat(actor2names, actor3names).sort());

    //Drop undefined value
    actors_set.delete(undefined);

    // for(let actor of actors_set)
    // {
    //     if(getMoviesFor("actor", actor).length < 2) //Drop actor if involved in less than 2 movies
    //         actors_set.delete(actor);
    // }

    return actors_set;
}

/**
 *  Returns a sorted set of all (unique) directors
 */
function getDirectors() {

    //Get all directors
    let directorNames = excelMovies.map(d => { if(d["director_name"] && d["director_name"].trim().length > 0) return d["director_name"]; });

    //Merge all actors and sort. Then remove duplicates using set
    let directors_set = new Set(directorNames.sort());

    //Drop undefined value
    directors_set.delete(undefined);

    // for(let director of directors_set)
    // {
    //     if(getMoviesFor("director", director).length < 2) //Drop director if involved in less than 2 movies
    //         directors_set.delete(director);
    // }

    return directors_set;
}

/**
 *  Returns a sorted set of all (unique) genres
 */
function getGenres() {

    let genres_set = new Set();

    excelMovies.forEach((movie) => {
        let movieGenres = movie["genres"].split("|");
        movieGenres.forEach((genre) => {
            genres_set.add(genre);
        })
    });

    //Sort the genres
    genres_set = new Set(Array.from(genres_set).sort());

    return genres_set;
}

/**
 *  Returns all movies associated for a given actor/director sorted by year
 */
function getMoviesFor(actorOrDirector, name) {

    let movies = [];
    let movies_set = new Set();

    if(actorOrDirector == "actor")
    {
        //Extract movies which involve the selected actor
        excelMovies.forEach((movie) => {

            if(!movies_set.has(movie["movie_title"]))   //Avoid movie duplication using set
            {
                if(movie["actor_1_name"] == name || movie["actor_2_name"] == name || movie["actor_3_name"] == name)
                {
                    if(!isNaN(parseInt(movie["title_year"])))
                    {
                        movies_set.add(movie["movie_title"]);
                        movies.push(movie);
                    }
                }
            }
        });
    }
    else
    {
        //Extract movies which involve the selected director
        excelMovies.forEach((movie) => {

            if(!movies_set.has(movie["movie_title"]))   //Avoid movie duplication using set
            {
                if(movie["director_name"] == name)
                {
                    if(!isNaN(parseInt(movie["title_year"])))
                    {
                        movies_set.add(movie["movie_title"]);
                        movies.push(movie);
                    }
                }
            }
        });
    }

    //Sort the movies by year
    movies = (movies).slice().sort(function (movie1, movie2) {

        if(parseInt(movie1["title_year"]) < parseInt(movie2["title_year"]))
            return -1;
        else if(parseInt(movie1["title_year"]) > parseInt(movie2["title_year"]))
            return 1;
        else
            return 0;
    });

    return movies;
}

/**
 *  Call the actor/director search filter updater and update the actor/director update button
 */
function switchActorDirector(choice) {

    updateSearchFilter(choice.value);
    document.getElementById("updateActorDirector").innerText = "Update " + choice.value;
}

/**
 *  Update the actor/director search filter based on actor/director radio button selection
 */
function updateSearchFilter(actorOrDirector) {

    let actorDirectorInput = document.getElementById("actorDirector_name");
    let actorDirectorList = document.getElementById("actorDirector_names");

    //Clear existing values
    actorDirectorInput.value = "";
    actorDirectorList.innerHTML = "";

    let frag = document.createDocumentFragment();

    if(actorOrDirector == "actor")
    {
        for (let actor of allActors)
        {
            let option = document.createElement("option");
            option.textContent = actor;
            option.value = actor;
            frag.appendChild(option);
        }

        //Add actor names to search filter
        document.getElementById("actorDirector_names").appendChild(frag);
        //Update the input placeholder
        actorDirectorInput.setAttribute("placeholder", "Search Actor");
    }
    else
    {
        for (let director of allDirectors)
        {
            let option = document.createElement("option");
            option.textContent = director;
            option.value = director;
            frag.appendChild(option);
        }

        //Add director names to search filter
        document.getElementById("actorDirector_names").appendChild(frag);
        //Update the input placeholder
        actorDirectorInput.setAttribute("placeholder", "Search Director");
    }
}

/**
 *  Update the actor/director trend plot based on selected parameters
 */
function updateTrendPlot() {

    let name = d3.select("#actorDirector_name").node().value;
    let selectedAttribute = d3.select("#attributes").node().value;

    if(document.getElementsByName("actorOrDirector")[0].checked)    //If current radio button selection is "Actor"
    {
        if(allActors.has(name))
        {
            actorDirectorStats = new ActorDirectorStats("Actor", name, getMoviesFor("actor", name), selectedAttribute);
            actorDirectorStats.plot();
        }
    }
    else    //If current radio button selection is "Director"
    {
        if(allDirectors.has(name))
        {
            actorDirectorStats = new ActorDirectorStats("Director", name, getMoviesFor("director", name), selectedAttribute);
            actorDirectorStats.plot();
        }
    }
}

/**
 *  Check the drop-down for the currently selected attribute and update the plot accordingly.
 *  There are 3 attributes that can be selected: imdb_score, gross or budget
 */
function updateAttribute() {

    let selectedAttribute = d3.select("#attributes").node().value;
    actorDirectorStats.attribute = selectedAttribute;
    actorDirectorStats.plot();
}

/**
 *  Update the movies table & node-link diagram based on filter selection
 */
function processFilters() {

    let matchingMovies = getMoviesForFilters();

    if(matchingMovies.length > 0)
    {
        movieTable = new MovieTable(matchingMovies);
        movieTable.create();
        movieTable.update();

        let nodelinkfd = new NodeLinkFD(matchingMovies);
        nodelinkfd.update();
    }
}

/**
 *  Return matching movies for the selected year, rating and genre filter values
 */
function getMoviesForFilters() {

    selectedGenres = [];

    allGenres.forEach((genre) => {
        let currentGenre = document.getElementById(genre);

        if(currentGenre.checked)
            selectedGenres.push(currentGenre.getAttribute("value"));
    });

    let isYearFilterSet = (selectedYears.length > 0);
    let isRatingFilterSet = (selectedRatings.length > 0);
    let isGenreFilterSet = (selectedGenres.length > 0);

    let matchingMovies = [];
    let matchingMovies_set = new Set();

    if(isYearFilterSet || isRatingFilterSet || isGenreFilterSet)    //If at least one filter has been set by user
    {
        excelMovies.forEach((movie) => {

            let yearMatches = true;

            if(isYearFilterSet)
            {
                let currentMovieYear = parseInt(movie["title_year"]);
                let startYear = selectedYears[0].start;
                let endYear = selectedYears[0].end;

                if(!isNaN(currentMovieYear))
                {
                    if(!(currentMovieYear >= startYear && currentMovieYear <= endYear))
                        yearMatches = false;
                }
                else
                    yearMatches = false;
            }

            let ratingMatches = true;

            if(isRatingFilterSet)
            {
                let currentMovieRating = parseFloat(movie["imdb_score"]);
                let startRating = selectedRatings[0].start;
                let endRating = selectedRatings[0].end;

                if(!isNaN(currentMovieRating))
                {
                    if(!(currentMovieRating >= startRating && currentMovieRating <= endRating))
                        ratingMatches = false;
                }
                else
                    ratingMatches = false;
            }

            let genresMatch = false;

            if(isGenreFilterSet)
            {
                for(let genreIndex = 0; genreIndex < selectedGenres.length; genreIndex++)
                {
                    if(movie["genres"].includes(selectedGenres[genreIndex]))
                    {
                        genresMatch = true;
                        break;
                    }
                }
            }
            else
                genresMatch = true;


            if(yearMatches && ratingMatches && genresMatch)
            {
                if(!matchingMovies_set.has(movie["movie_title"]))   //Avoid movie duplication using set
                {
                    matchingMovies_set.add(movie["movie_title"]);
                    matchingMovies.push(movie);
                }
            }
        })
    }

    return matchingMovies;
}