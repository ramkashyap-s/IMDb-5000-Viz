

d3.csv("data/movie_metadata.csv", function (error, movies) {

    let movieTable = new MovieTable(movies);
    movieTable.create();
    movieTable.update();
});