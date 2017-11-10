
class ActorStats
{
    constructor(movies, actor)
    {
        this.actor = actor;
        this.actor_movies = [];

        //Extract movies which involve the selected actor
        movies.forEach((movie) => {

            if(movie["actor_1_name"] == actor || movie["actor_2_name"] == actor || movie["actor_3_name"] == actor)
            {
                if(!isNaN(parseInt(movie["title_year"])))
                    this.actor_movies.push(movie);
            }
        });
    }

    plot()
    {
        //Sort the movies by year
        this.actor_movies = (this.actor_movies).slice().sort(function (movie1, movie2) {

            if(parseInt(movie1["title_year"]) < parseInt(movie2["title_year"]))
                return -1;
            else if(parseInt(movie1["title_year"]) > parseInt(movie2["title_year"]))
                return 1;
            else
                return 0;
        });

        let actorStats_Div = d3.select("#actorStats");

        let margin = {top: 20, right: 20, bottom: 100, left: 70},
            svgBounds = actorStats_Div.node().getBoundingClientRect(),
            width = svgBounds.width - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        let svg = actorStats_Div.append("svg")
            .attr("width", svgBounds.width)
            .attr("height", 450 + margin.top + margin.bottom);

        let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let xScale = d3.scaleBand()
            .domain((this.actor_movies).map(d => d["movie_title"]))
            .range([0, width]);

        let yScale = d3.scaleLinear()
            .domain(d3.extent(this.actor_movies, (d) => { return parseFloat(d["imdb_score"])}))
            .range([height, 0]);

        //Add the y Axis
        g.append("g")
            .call(d3.axisLeft(yScale));

        svg.append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("dy", "1.50em")
            .attr("text-anchor", "middle")
            .text("IMDB Rating");

        //Add the x Axis
        g.append("g")
            .attr("transform", "translate(" + 0 + "," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        svg.append("text")
            .attr("fill", "#000")
            .attr("x", width/1.5)
            .attr("y", height*1.6)
            .attr("text-anchor", "middle")
            .text(this.actor + "'s" + " movies");

        //Add the plot points
        let points = g.selectAll("circle")
            .data(this.actor_movies);

        let pointsEnter = points.enter().append("circle")
            .attr("r", 4)
            .attr("cx", (d) => { return xScale(d["movie_title"]); })
            .attr("cy", (d) => { return yScale(d["imdb_score"]); });

        //Add the line graph
        let lineGraph = d3.line()
            .x(function(d) { return xScale(d["movie_title"]); })
            .y(function(d) { return yScale(d["imdb_score"]); });

        g.append("path")
            .data([this.actor_movies])
            .attr("class", "line")
            .attr("d", lineGraph);
    }

}