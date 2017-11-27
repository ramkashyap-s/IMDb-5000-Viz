
class Filters {

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
        let that = this;

        //creating svg for year slider
        let yearsvg = d3.select("#yearSlider").append("svg")
            .attr("width", this.svgWidth + this.margin.right*2)
            .attr("height", this.svgHeight)

        // setup range for yearslider
        let xyear = d3.scaleLinear()
            .domain([1916, 2016])
            .range([0, this.svgWidth])
            .clamp(true);


        //creating group for yearslider
        let yearslider = yearsvg.append("g")
            .attr("class", "slider")
            .attr("transform", "translate(" + this.margin.left/2 + "," + this.svgHeight/4  + ")");

        // axis
        yearslider.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.svgHeight/2 + ")")
            .call(d3.axisBottom(xyear).tickFormat(d3.format("d"))
            );


        //creating year slider/line
        let yearbrush = d3.brushX()
            .extent([[0, 0], [this.svgWidth, this.svgHeight/3]])
            .on("start end", brushmoved);

        //.on("start brush end", brushmoved);


        let yearRect = yearslider.append("rect")
            .attr("width", xyear.range()[1] - xyear.range()[0])
            .attr("height", 25)
            .attr("rx",15,"ry",15)
            .attr("class","rangeSlider")
            .attr("transform", "translate(0,10)")
            //.attr("transform", "translate(0," + this.svgHeight/10 + ")")


        let gYearBrush = yearslider.append("g")
            .attr("class", "brush")
            .attr("transform", "translate(0,6)")
            .call(yearbrush);

        let handle = gYearBrush.selectAll(".handle--custom")
            .data([{type: "w"}, {type: "e"}])
            .enter().append("path")
            .attr("class", "handle--custom")
            .attr("fill", "#666")
            .attr("fill-opacity", 0.8)
            .attr("stroke", "#000")
            .attr("stroke-width", 1.5)
            .attr("cursor", "ew-resize");

        gYearBrush.call(yearbrush.move)//, [0.3, 0.5].map(xyear));
        let yearSelected = [];
        function brushmoved() {
            let s = d3.event.selection;
            if (s == null) {
                handle.attr("display", "none");
            } else {
                //let sx = s.map(xyear.invert);
                let start = Math.round(xyear.invert(s[0]));
                let end = Math.round(xyear.invert(s[1]));
                yearSelected = [];
                yearSelected.push({start, end})
                console.log(yearSelected);
                handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + s[i] + "," + that.svgHeight /4 + ")"; });
            }
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
            .attr("height", this.svgHeight)

        //creating group for yearslider
        let ratingSlider = ratingsvg.append("g")
            .attr("class", "slider")
            .attr("transform", "translate(" + this.margin.left/2 + "," + this.svgHeight/4  + ")");

        // axis
        ratingSlider.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.svgHeight/2 + ")")
            .call(d3.axisBottom(xrating));


        //creating year slider/line
        let ratingBrush = d3.brushX()
            .extent([[0, 0], [this.svgWidth, this.svgHeight/3]])
            .on("start end", ratingBrushMoved);


        let ratingRect = ratingSlider.append("rect")
            .attr("width", xrating.range()[1] - xyear.range()[0])
            .attr("height", 25)
            .attr("rx",15,"ry",15)
            .attr("class","rangeSlider")
            .attr("transform", "translate(0,10)")
        //.attr("transform", "translate(0," + this.svgHeight/10 + ")")


        let gRatingBrush = ratingSlider.append("g")
            .attr("class", "brush")
            .attr("transform", "translate(0,6)")
            .call(ratingBrush);

        let ratingHandle = gYearBrush.selectAll(".handle--custom")
            .data([{type: "w"}, {type: "e"}])
            .enter().append("path")
            .attr("class", "handle--custom")
            .attr("fill", "#666")
            .attr("fill-opacity", 0.8)
            .attr("stroke", "#000")
            .attr("stroke-width", 1.5)
            .attr("cursor", "ew-resize");

        gYearBrush.call(ratingBrush.move)//, [0.3, 0.5].map(xyear));
        let ratingSelected = []
        function ratingBrushMoved() {
            let s = d3.event.selection;
            if (s == null) {
                ratingHandle.attr("display", "none");
                //circle.classed("active", false);
            } else {
                //let sx = s.map(xrating.invert);
                let start = Math.round(xrating.invert(s[0]) * 10) / 10;
                let end = Math.round(xrating.invert(s[1]) * 10) / 10;
                ratingSelected = [];
                ratingSelected.push({start, end})
                console.log(ratingSelected);
                ratingHandle.attr("display", null).attr("transform", function(d, i) { return "translate(" + s[i] + "," + that.svgHeight /4 + ")"; });
            }
        }


        //---------------//genre checkboxes //---------------//
        let genresvg = d3.select("#genreCheckBox").append("svg")
            .attr("width", this.svgWidth + this.margin.right*2)
            .attr("height", this.svgHeight*3)
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

        let selectedGenre = new Set([]);

        let checkBox = genreg.selectAll("foreignObject")

        checkBox
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
            .html((d) => {return "<input type='checkbox' value = " + d + " id = i" + d + ">"})

        // .html((d) => {return "<label class='inline'><input type='checkbox' value = " + d + "><span class='lbl'></span></label>"})
        //     .on("click", function(d, i){
        //         //console.log(d3.select("#i"+d).node.checked);
        //         //console.log(d3.select(this).node());
        //         if(d3.select(this).node().checked == true){
        //             d3.select(this).property('checked', false);
        //             if (selectedGenre.has(d)) {
        //                 selectedGenre.delete(d)
        //             }
        //             console.log("unchecked" + d)
        //         }
        //         else{
        //             d3.select(this).property('checked', true);
        //             console.log("checked" + d)
        //             selectedGenre.add(d)
        //         }
        //         console.log(selectedGenre);
        //     })
        // console.log(selectedGenre);

        let checked = [];
        let filterSubmit = d3.select("#filterSubmit")//.select("button")
            .on("click", function() {
                let boxes = checkBox.selectAll("input.checkbox:checked");
                console.log(boxes)
                console.log(yearSelected);
                console.log(ratingSelected);

                boxes.each(function() {
                    checked.push(this.value)
                });
                console.log(checked)
            });


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

        // var scalev3 = d3v3.scale.linear()
        //     .range([0, 5000])
        // console.log(scalev3(0.4))


     }; // close create

}