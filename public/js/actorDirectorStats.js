
class ActorDirectorStats
{
    constructor(actorOrDirector, name, movies, attribute)
    {
        this.actorOrDirector = actorOrDirector; //Indicates the entity whose stats are being plotted
        this.name = name;                       //Actor or director's name
        this.movies = movies;                   //Actor or director's movies
        this.attribute = attribute;             //Movie attribute to plot
    }

    plot()
    {
        let actorDirectorStats_Div = d3.select("#actorDirectorStats");

        let margin = {top: 20, right: 20, bottom: 100, left: 100},
            svgBounds = actorDirectorStats_Div.node().getBoundingClientRect(),
            width = svgBounds.width - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        let svg = d3.select("#trend-plot")
            .attr("width", svgBounds.width)
            .attr("height", 450 + margin.top + margin.bottom);

        let g = d3.select("#trend-plot-group")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let xScale = d3.scaleBand()
            .domain((this.movies).map(d => d["movie_title"]))
            .range([0, width]);

        let yScale = d3.scaleLinear()
            .domain(d3.extent(this.movies, (d) => { return parseFloat(d[this.attribute])}))
            .range([height, 0]);

        //Add the y Axis
        d3.select("#yAxis")
            .call(d3.axisLeft(yScale));

        //Add the y Axis label
        let yLabel = d3.select("#yLabel").selectAll("text")
            .data([this.attribute]);

        let yLabelEnter = yLabel.enter().append("text");
        yLabel.exit().remove();
        yLabel = yLabel.merge(yLabelEnter)
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("y", -width/7)
            .attr("text-anchor", "middle")
            .text((d) => { return d; });

        //Add the x Axis
        d3.select("#xAxis")
            .attr("transform", "translate(" + 0 + "," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        let xLabelText = (this.actorOrDirector) + " " + this.name + "'s" + " movies";

        //Add the x Axis label
        let xLabel = d3.select("#xLabel").selectAll("text")
            .data([xLabelText]);

        let xLabelEnter = xLabel.enter().append("text");
        xLabel.exit().remove();
        xLabel = xLabel.merge(xLabelEnter)
            .attr("fill", "#000")
            .attr("x", width/2)
            .attr("y", height*1.6)
            .attr("text-anchor", "middle")
            .text((d) => { return d; });

        //Add the plot points
        let points = g.selectAll("circle")
            .data(this.movies);

        let pointsEnter = points.enter().append("circle");
        points.exit().remove();
        points = points.merge(pointsEnter)
            .attr("r", 4)
            .attr("cx", (d) => { return xScale(d["movie_title"]); })
            .attr("cy", (d) => { return yScale(d[this.attribute]); });

        //Add the line graph
        let lineGraph = d3.line()
            .x((d) => { return xScale(d["movie_title"]); })
            .y((d) => { return yScale(d[this.attribute]); });

        let lines = g.selectAll(".line")
            .data([this.movies]);

        let linesEnter = lines.enter().append("path");
        lines.exit().remove();
        lines = lines.merge(linesEnter)
            .attr("class", "line")
            .attr("d", lineGraph);
    }
}