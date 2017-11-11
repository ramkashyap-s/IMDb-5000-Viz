d3.csv("data/movie_metadata.csv", function (error, movies) {

    //Render the selected movies table
    let movieTable = new MovieTable(movies);
    movieTable.create();
    movieTable.update();

    //Render the plot for the selected actor
    let actorStats = new ActorStats(movies, "Tom Hanks");
    actorStats.plot();

    let yearChart = new YearChart(movies);
    yearChart.create();
    let moviesGroupedByRating = d3.nest()
        .key( (d) => { return d["imdb_score"]; } ).sortKeys(d3.ascending)
        .entries(movies);

    let budgetVsRating = new BudgetVsRating(moviesGroupedByRating);
    budgetVsRating.plot();

});