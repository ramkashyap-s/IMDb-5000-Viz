d3.csv("data/movie_metadata.csv", function (error, movies) {

    window.excelMovies = movies;
    window.allActors = getActors();
    window.allDirectors = getDirectors();
    window.allMovies = getAllMovies();

    //Initialize default values for the actor/director search filter
    updateSearchFilter("actor");

    //Render the plot for the default actor
    window.actorDirectorStats = new ActorDirectorStats("Actor", "Tom Hanks", getMoviesFor("actor", "Tom Hanks"), "imdb_score");
    actorDirectorStats.plot();

    //Render the selected movies table
    let movieTable = new MovieTable(movies);
    movieTable.create();
    movieTable.update();

    //filters
    let filters = new Filters(movies);
    filters.create();


    let moviesGroupedByRating = d3.nest()
        .key( (d) => { return d["imdb_score"]; } ).sortKeys(d3.ascending)
        .entries(movies);

    let budgetVsRating = new BudgetVsRating(moviesGroupedByRating);
    budgetVsRating.plot();

});

//graph : node-link
d3.csv("data/movie_metadata_actor_director.csv", function (error, movies) {
    let nodelink = new NodeLink(movies);
    nodelink.update();

});

/**
 *  Returns a sorted set of all (unique) movies
 */
function getAllMovies() {

    //Get all directors
    let movieNames = excelMovies.map(d => { if(d["movie_title"] && d["movie_title"].trim().length > 0) return d["movie_title"];});

    //Merge all movies and sort. Then remove duplicates using set
    let movies_set = new Set(movieNames.sort());

    //Drop undefined value
    movies_set.delete(undefined);

    return movies_set;
}

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

    return actors_set;
}

/**
 *  Returns a sorted set of all (unique) directors
 */
function getDirectors() {

    //Get all directors
    let directorNames = excelMovies.map(d => { if(d["director_name"] && d["director_name"].trim().length > 0) return d["director_name"];});

    //Merge all actors and sort. Then remove duplicates using set
    let directors_set = new Set(directorNames.sort());

    //Drop undefined value
    directors_set.delete(undefined);

    return directors_set;
}

/**
 *  Returns all movies associated for a given actor/director sorted by year
 */
function getMoviesFor(actorOrDirector, name) {

    let movies = [];

    if(actorOrDirector == "actor")
    {
        //Extract movies which involve the selected actor
        excelMovies.forEach((movie) => {

            if(movie["actor_1_name"] == name || movie["actor_2_name"] == name || movie["actor_3_name"] == name)
            {
                if(!isNaN(parseInt(movie["title_year"])))
                    movies.push(movie);
            }
        });
    }
    else
    {
        //Extract movies which involve the selected director
        excelMovies.forEach((movie) => {

            if(movie["director_name"] == name)
            {
                if(!isNaN(parseInt(movie["title_year"])))
                    movies.push(movie);
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
 *  Check the actor/director radio button selection and call the actor/director search filter updater
 */
function switchActorDirector(choice) {
    updateSearchFilter(choice.value);
}

/**
 *  Update the actor/director search filter based on actor/director radio button selection
 */
function updateSearchFilter(actorOrDirector) {

    let actorDirectorList = document.getElementById("actorDirector_names");

    //Clear existing values
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
    }
}

/**
 *  Update the actor/director trend plot based on selected parameters
 */
function updateActorOrDirector() {

    let name = d3.select("#actorDirector_name").node().value;
    let movies = [];
    let selectedAttribute = d3.select("#attributes").node().value;

    if(document.getElementsByName("actorOrDirector")[0].checked)    //If current radio button selection is "Actor"
    {
        movies = getMoviesFor("actor", name);

        if(movies.length > 0)
        {
            actorDirectorStats = new ActorDirectorStats("Actor", name, movies, selectedAttribute);
            actorDirectorStats.plot();
        }
        else
            console.log("No movies found for actor " + name);
    }
    else                                                            //If current radio button selection is "Director"
    {
        movies = getMoviesFor("director", name);

        if(movies.length > 0)
        {
            actorDirectorStats = new ActorDirectorStats("Director", name, movies, selectedAttribute);
            actorDirectorStats.plot();
        }
        else
            console.log("No movies found for director " + name);
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

