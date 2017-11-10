
class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param

     */
    constructor () {

        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let filters = d3.select("#filters");

        //fetch the svg bounds
        this.svgBounds = filters.node().getBoundingClientRect();
        this.svgWidth = (this.svgBounds.width - this.margin.left - this.margin.right)/2;
        this.svgHeight = 100;

        //add the svg to the div
        // this.svg = slider.append("svg")
        //     .attr("width", this.svgWidth)
        //     .attr("height", this.svgHeight)

        this.years = [];
        for(let i=1916;i<2016; i = i+5){
            this.years.push(i);
        }
        this.ratings = [];
        for(let i = 1.6; i<9.5; i = i+0.5){
            this.ratings.push(i);
        }
    };



    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    create () {

        let yearsvg = d3.select("#yearSlider").append("svg")
            .attr("width", this.svgWidth + this.margin.right*2)
            .attr("height", this.svgHeight/2)
        let xyear = d3.scaleLinear()
            .domain([1916, 2016])
            .range([0, this.svgWidth])
            .clamp(true);

        let yearslider = yearsvg.append("g")
            .attr("class", "slider")
            .attr("transform", "translate(" + this.margin.left/2 + "," + this.svgHeight/4  + ")");

        yearslider.append("line")
            .attr("class", "track")
            .attr("x1", xyear.range()[0])
            .attr("x2", xyear.range()[1])
            //.attr("y", "50%")
            .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-inset")
            .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-overlay")
            .call(d3.drag()
                .on("start.interrupt", function() { yearslider.interrupt(); })
                .on("start drag", function() { }));//console.log(xyear.invert(d3.event.xyear)) hue(x.invert(d3.event.x)); }));

        yearslider.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(0," + 18 + ")")
            .selectAll("text")
            .data(xyear.ticks(this.years.length))
            .enter().append("text")
            .attr("x", xyear)
            .attr("text-anchor", "middle")
            .text(function(d) { return d });

        let yearhandle = yearslider.insert("circle", ".track-overlay")
            .attr("class", "handle")
            .attr("r", 9);

        yearslider.transition()
            .duration(750)
            .tween("hue", function() {
                //let i = d3.interpolate(0, 70);
                //return function(t) { hue(i(t)); };
            });



        //ratings slider

        let xrating = d3.scaleLinear()
            .domain([1.6, 9.0])
            .range([0, this.svgWidth])
            .clamp(true);

        let ratingsvg = d3.select("#ratingSlider").append("svg")
            .attr("width", this.svgWidth + this.margin.right*2)
            .attr("height", this.svgHeight/2)

        let ratingslider = ratingsvg.append("g")
            .attr("class", "slider")
            .attr("transform", "translate(" + this.margin.left/2 + "," + this.svgHeight/4  + ")");

        ratingslider.append("line")
            .attr("class", "track")
            .attr("x1", xrating.range()[0])
            .attr("x2", xrating.range()[1])
            //.attr("y", "50%")
            .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-inset")
            .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-overlay")
            .call(d3.drag()
                .on("start.interrupt", function() { ratingslider.interrupt(); })
                .on("start drag", function() {
                    //console.log(xrating.invert(d3.mouse(this)))
                    //console.log((d3.mouse(this)))
                }));//console.log(xyear.invert(d3.event.xyear)) hue(x.invert(d3.event.x)); }));

        ratingslider.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(0," + 18 + ")")
            .selectAll("text")
            .data(xrating.ticks(this.years.length))
            .enter().append("text")
            .attr("x", xrating)
            .attr("text-anchor", "middle")
            .text(function(d) { return d });

        let ratinghandle = ratingslider.insert("circle", ".track-overlay")
            .attr("class", "handle")
            .attr("r", 9);

        ratingslider.transition()
            .duration(750)
            .tween("hue", function() {
                //let i = d3.interpolate(0, 70);
                //return function(t) { hue(i(t)); };

            });
        // console.log("svgbounds", this.svgBounds);
        //
        // let x = d3.scaleLinear()
        //     .domain([1916, 2016])
        //     .range([0, this.svgWidth-this.margin.right])
        //     .clamp(true);
        //
        // let dispatch = d3.dispatch("sliderChange");
        //
        // // let slider = d3.select(".slider")
        // //     .style("width", this.svgWidth);
        // let slider = this.slider;
        //
        //
        // let sliderTray = slider.append("div")
        //     .attr("class", "slider-tray");
        //
        // let sliderHandle = slider.append("div")
        //     .attr("class", "slider-handle");
        //
        // sliderHandle.append("div")
        //     .attr("class", "slider-handle-icon")
        //
        //
        // slider.call(d3.drag()
        //     .on("start.interrupt", function() {
        //         dispatch.sliderChange(x.invert(d3.mouse(sliderTray.node())[0]));
        //         d3.event.sourceEvent.preventDefault();
        //     })
        //     .on("drag", function() {
        //         dispatch.sliderChange(x.invert(d3.mouse(sliderTray.node())[0]));
        //     }));
        //
        // dispatch.on("sliderChange.slider", function(value) {
        //     sliderHandle.style("left", x(value) + "px")
        // });
        // //labels
        //
        // let textg = this.slider.append('g');
        //
        // let svgYearText = this.svg.selectAll('text').data(this.years);
        //
        // let svgYearTextEnter = svgYearText.enter().append('text');
        //
        // svgYearText = svgYearTextEnter.merge(svgYearText);
        //
        // svgYearText
        //     .attr("x", (d,i) => {
        //         console.log("hi");
        //         let xvalue = (this.margin.left + (i * this.svgWidth/(this.electionWinners.length+1)));
        //         return xvalue;
        //     })
        //     .attr("y", '95%')
        //     .text(function (d) {
        //         return d;
        //     });


    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: Use .highlighted class to style the highlighted circle


        //svgRect.on("click", );

        //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations


    //
    //     let that = this
    //     let brushed = function (d) {
    //         let selection = d3.event.selection;
    //         //console.log("brush selection: "+selection);
    //         let start
    //         let end;
    //         if(selection) {
    //             start = yScale.invert(selection[0]);
    //             end = yScale.invert(selection[1]);
    //         }
    //         let selectionStates = []
    //         if(selection) {
    //             for (let i = 0; i < statesData.length; i++) {
    //                 //console.log("hi im in for loop")
    //                 //console.log("xval: "+statesData[i].xvalue +" start "+ start)
    //                 if (statesData[i].xvalue >= start && (statesData[i].xvalue + parseInt(statesData[i].Total_EV)) <= end) {
    //                     selectionStates.push(statesData[i].Abbreviation);
    //                 }
    //             }
    //             //console.log("selection states: " + selectionStates);
    //             that.shiftChart.update(selectionStates);
    //         }
    //
    //     };
    //
    //     let brush = d3.brushX().extent([[0,this.svgHeight/2.2],[this.svgWidth,this.svgHeight/1.3]]).on("end", brushed);
    //
    //     this.svg.append("g").attr("class", "brush").call(brush);
    //
    //     //this.svg.select("#brush").call(brush.move, null);
    //
     };

}