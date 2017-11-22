
class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param

     */
    constructor (movies) {

        // Initializes the svg elements required for this chart
        this.movies = movies;
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let filters = d3.select("#filters");

        //fetch the svg bounds
        this.svgBounds = filters.node().getBoundingClientRect();
        this.svgWidth = (this.svgBounds.width - this.margin.left - this.margin.right);
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
        //creating svg for year slider
        let yearsvg = d3.select("#yearSlider").append("svg")
            .attr("width", this.svgWidth + this.margin.right*2)
            .attr("height", this.svgHeight/2)

        // setup range for yearslider
        let xyear = d3.scaleLinear()
            .domain([1916, 2016])
            .range([0, this.svgWidth])
            .clamp(true);

        //creating group for yearslider
        let yearslider = yearsvg.append("g")
            .attr("class", "slider")
            .attr("transform", "translate(" + this.margin.left/2 + "," + this.svgHeight/4  + ")");

        //creating year slider/line
        yearslider.append("line")
            .attr("class", "track")
            .attr("x1", xyear.range()[0])
            .attr("x2", xyear.range()[1])
            //.attr("y", "50%")
            .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-inset")
            .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-overlay")
            .call(d3.drag() //on drag change the position of the year handle
                .on("start.interrupt", function() { yearslider.interrupt(); })
                //.on("start drag", function() { console.log(xyear.invert(d3.event.xyear))}))
                .on("start drag", function() { setyearhandle(xyear.invert(d3.event.x)); }));

        // insert ticks and text
        yearslider.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(0," + 18 + ")")
            .selectAll("text")
            .data(xyear.ticks(this.years.length))
            .enter().append("text")
            .attr("x", xyear)
            .attr("text-anchor", "middle")
            .text(function(d) { return d });

        // create handle/ circle
        let yearhandle = yearslider.insert("circle", ".track-overlay")
            .attr("class", "handle")
            .attr("r", 9);

        yearslider.transition()
            .duration(750)
            .tween("hue", function() {
                //let i = d3.interpolate(0, 70);
                //return function(t) { hue(i(t)); };
            });

        // function to set the position of yearhandle
        function setyearhandle(h) {
            yearhandle.attr("cx", xyear(Math.round(h)));
            //svgFilter.style("background-color", d3.hsl(xYearFirst.invert(handle1.attr("cx")), 0.8, 0.8));
            //updateFilterText();
        }


        //ratings slider
        //setup scale for rating slider
        let xrating = d3.scaleLinear()
            .domain([1.6, 9.0])
            .range([0, this.svgWidth])
            .clamp(true);

        //create svg element for rating slider
        let ratingsvg = d3.select("#ratingSlider").append("svg")
            .attr("width", this.svgWidth + this.margin.right*2)
            .attr("height", this.svgHeight/2)

        //create g element for rating slider
        let ratingslider = ratingsvg.append("g")
            .attr("class", "slider")
            .attr("transform", "translate(" + this.margin.left/2 + "," + this.svgHeight/4  + ")");

        //create line/slider
        ratingslider.append("line")
            .attr("class", "track")
            .attr("x1", xrating.range()[0])
            .attr("x2", xrating.range()[1])
            //.attr("y", "50%")
            .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-inset")
            .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-overlay")
            .call(d3.drag() // on drag change the position of the handler
                .on("start.interrupt", function() { ratingslider.interrupt(); })
                .on("start drag", function() {
                    setratinghandle(xrating.invert(d3.event.x));
                    //console.log(xyear.invert(d3.event.xyear)) hue(x.invert(d3.event.x)); }));
                    //console.log(xrating.invert(d3.mouse(this)))
                    //console.log((d3.mouse(this)))
                }));

        // create ticks and text for the slider
        ratingslider.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(0," + 18 + ")")
            .selectAll("text")
            .data(xrating.ticks(this.years.length))
            .enter().append("text")
            .attr("x", xrating)
            .attr("text-anchor", "middle")
            .text(function(d) { return d });

        // create handle/ circle
        let ratinghandle = ratingslider.insert("circle", ".track-overlay")
            .attr("class", "handle")
            .attr("r", 9);

        ratingslider.transition()
            .duration(750)
            .tween("hue", function() {
                //let i = d3.interpolate(0, 70);
                //return function(t) { hue(i(t)); };

            });
        // function to set the position of ratinghandle
        function setratinghandle(h) {
            ratinghandle.attr("cx", xrating(h));
            //svgFilter.style("background-color", d3.hsl(xYearFirst.invert(handle1.attr("cx")), 0.8, 0.8));
            //updateFilterText();
        }

        //genre checkboxes
        let genresvg = d3.select("#genreCheckBox").append("svg")
            .attr("width", this.svgWidth + this.margin.right*2)
            .attr("height", this.svgHeight*3.5)
        let genreg = genresvg.append("g")
            .attr("transform", "translate(" + this.margin.left/2 + "," + this.svgHeight/4  + ")");

        //console.log(this.movies[0].genres);
        let genreset = new Set([]);

        this.movies.forEach(function(movie) {
            let split = movie.genres.split('|');
            split.forEach(function (genre) {
                if (!genreset.has(genre)) {
                    genreset.add(genre);
                }
            })
        })
        let genrelist = [...genreset];

        //console.log(genrelist);
        let that = this;
        genreg.selectAll("foreignObject")
            .data(genrelist).enter()
            .append("foreignObject")
            .attr('x', function(d,i){
                if(i >= genrelist.length/2){
                    return that.svgWidth/3;
                }
                return 0;
            })
            .attr('y',  function(d,i){
                if(i >= genrelist.length/2){
                    return (i - (genrelist.length/2))*that.svgWidth/genrelist.length;
                }
                return i*that.svgWidth/genrelist.length;
            })
            .attr('width', 30)
            .attr('height', 20)
            .append("xhtml:body")
            .append('label')
            .html((d) => {return "<label class='inline'><input type='checkbox'>" + "<span class='lbl'></span></label>"});



        genreg.selectAll("text").data(genrelist).enter()
            .append('text')
            .attr('x', function(d,i){
                if(i >= genrelist.length/2){
                    return 20 + that.svgWidth/3;
                }
                return 20;
            })
            .attr('y',  function(d,i){
                if(i >= genrelist.length/2){
                    return (i+1 - (genrelist.length/2))*that.svgWidth/genrelist.length;
                }
                return (i+1)*that.svgWidth/genrelist.length;
            })
            .text(function(d) { return d; });



















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