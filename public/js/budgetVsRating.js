
class BudgetVsRating
{
    constructor(moviesGroupedByRating)
    {
        this.ratings = moviesGroupedByRating;
    }

    plot()
    {
        let plotPoints = [];
        let cx, cy;
        let minRating = 1.6, maxRating = 9.5, minBudget = 218, maxBudget = 12215500000;

        (this.ratings).forEach(function (rating) {

            (rating.values).forEach(function (movie) {

                cx = parseFloat(rating.key);
                cy = parseInt(movie.budget);

                if(!isNaN(cx) && !isNaN(cy))
                    plotPoints.push({ "cx": cx, "cy": cy }) //Extract and store the points to be plotted
            });
        });

        let budgetVsRating_Div = d3.select("#budgetVsRating");

        let margin = {top: 20, right: 20, bottom: 30, left: 110},
            svgBounds = budgetVsRating_Div.node().getBoundingClientRect(),
            width = svgBounds.width - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;

        let svg = budgetVsRating_Div.append("svg")
            .attr("width", svgBounds.width)
            .attr("height", 450 + margin.top + margin.bottom);

        let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let xScale = d3.scaleLinear()
            .domain(d3.extent(plotPoints, (d) => { return d.cx}))
            .range([0, width]);

        let yScale = d3.scaleLinear()
            .domain(d3.extent(plotPoints, (d) => { return d.cy}))
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
            .text("Budget");

        //Add the x Axis
        g.append("g")
            .attr("transform", "translate(" + 0 + "," + height + ")")
            .call(d3.axisBottom(xScale));

        svg.append("text")
            .attr("fill", "#000")
            .attr("x", width/1.5)
            .attr("y", height*1.2)
            //.attr("dy", "3.50em")
            .attr("text-anchor", "middle")
            .text("IMDB Rating");

        let points = g.selectAll("circle")
            .data(plotPoints);

        let pointsEnter = points.enter().append("circle")
            .attr("r", 4)
            .attr("cx", (d) => { return xScale(d.cx); })
            .attr("cy", (d) => { return yScale(d.cy); });
    }
}