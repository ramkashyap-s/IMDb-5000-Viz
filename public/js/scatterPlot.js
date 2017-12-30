
class ScatterPlot
{
    constructor()
    {
        // this.movies = movies;
        this.movies = excelMovies;
        this.plotDiv = d3.select("#scatterPlot");

        this.margin = {top: 20, right: 20, bottom: 50, left: 110};
        let svgBounds = this.plotDiv.node().getBoundingClientRect();
        this.width = svgBounds.width - this.margin.left - this.margin.right;
        this.height = 450 - this.margin.top - this.margin.bottom;

        this.svg = this.plotDiv.append("svg")
            .attr("width", svgBounds.width)
            .attr("height", 450 + this.margin.top + this.margin.bottom);

    }

    plot(yAttribute, yLabel, xAttribute, xLabel)
    {
        console.log(xAttribute+": "+yAttribute)
        let plotPoints = [];
        let cx, cy;

        (this.movies).forEach((movie) => {
            cx = +(movie[xAttribute]);
            cy = +(movie[yAttribute]);

            if(!isNaN(cx) && !isNaN(cy))
                plotPoints.push({ "cx": cx, "cy": cy }) //Extract and store the points to be plotted
        });

        let xScale = d3.scaleLinear()
            .domain(d3.extent(plotPoints, (d) => { return d.cx}))
            .range([0, this.width]);

        xScale.nice();

        let yScale = d3.scaleLinear()
            .domain(d3.extent(plotPoints, (d) => { return d.cy}))
            .range([this.height, 0]);

        yScale.nice();
        /*
        //Select
         let g = this.svg.select("g");
         //enter
         let gEnter = this.svg.enter().append("g");
         //exit
         g.exit().remove();
         //merge
         g = gEnter.merge(g);
         //shift right
         // g.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        */
        let g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        g.append("g")
            .call(d3.axisLeft(yScale));

        //Add the y Axis
        /*
         .transition()
         .attr("opacity", 0)
         .duration(2000)
         .attr("opacity", 1)
         */



        this.svg.append("text")
            .attr("class", "font-weight-bold")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("x", -this.height/2)
            .attr("dy", "1.50em")
            .attr("text-anchor", "middle")
            .text(yLabel);

        //Add the x Axis
        g.append("g")
            .attr("transform", "translate(" + 0 + "," + this.height + ")")
            .call(d3.axisBottom(xScale));

        this.svg.append("text")
            .attr("class", "font-weight-bold")
            .attr("fill", "#000")
            .attr("x", this.width/1.5)
            .attr("y", this.height*1.2)
            //.attr("dy", "3.50em")
            .attr("text-anchor", "middle")
            .text(xLabel);

        let points = g.selectAll("circle")
            .data(plotPoints);

        let pointsEnter = points
            .enter().append("circle");

        points.exit().remove();

        points = pointsEnter.merge(points);

        points
            .transition()
            .attr("transform", "translate(" + 0 + "," + (-3) + ")")
            .attr("fill", "#000")
            .attr("opacity", 0.5)
            .attr("r", 4)
            .attr("cx", (d) => { return xScale(d.cx); })
            .attr("cy", (d) => { return yScale(d.cy); });


    }
}