
class ScatterPlot
{
    constructor(movies)
    {
        this.movies = movies;
    }

    plot(plotDivId, yAttribute, yLabel)
    {
        let plotPoints = [];
        let cx, cy;

        (this.movies).forEach((movie) => {

            cx = parseFloat(movie["imdb_score"]);
            cy = parseInt(movie[yAttribute]);

            if(!isNaN(cx) && !isNaN(cy))
                plotPoints.push({ "cx": cx, "cy": cy }) //Extract and store the points to be plotted
        });

        let plotDiv = d3.select("#" + plotDivId);

        let margin = {top: 20, right: 20, bottom: 50, left: 110},
            svgBounds = plotDiv.node().getBoundingClientRect(),
            width = svgBounds.width - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        let svg = plotDiv.append("svg")
            .attr("width", svgBounds.width)
            .attr("height", 450 + margin.top + margin.bottom);

        let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let xScale = d3.scaleLinear()
            .domain(d3.extent(plotPoints, (d) => { return d.cx}))
            .range([0, width]);

        xScale.nice();

        let yScale = d3.scaleLinear()
            .domain(d3.extent(plotPoints, (d) => { return d.cy}))
            .range([height, 0]);

        yScale.nice();

        //Add the y Axis
        g.append("g")
            .call(d3.axisLeft(yScale));

        svg.append("text")
            .attr("class", "font-weight-bold")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/2)
            .attr("dy", "1.50em")
            .attr("text-anchor", "middle")
            .text(yLabel);

        //Add the x Axis
        g.append("g")
            .attr("transform", "translate(" + 0 + "," + height + ")")
            .call(d3.axisBottom(xScale));

        svg.append("text")
            .attr("class", "font-weight-bold")
            .attr("fill", "#000")
            .attr("x", width/1.5)
            .attr("y", height*1.2)
            //.attr("dy", "3.50em")
            .attr("text-anchor", "middle")
            .text("IMDB Rating");

        let points = g.selectAll("circle")
            .data(plotPoints);

        let pointsEnter = points.enter().append("circle")
            .attr("transform", "translate(" + 0 + "," + (-3) + ")")
            .attr("fill", "#000")
            .attr("opacity", 0.5)
            .attr("r", 4)
            .attr("cx", (d) => { return xScale(d.cx); })
            .attr("cy", (d) => { return yScale(d.cy); });
    }
}