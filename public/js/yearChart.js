
class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param

     */
    constructor () {

        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        this.slider = d3.select(".slider");

        //fetch the svg bounds
        this.svgBounds = this.slider.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;

        //add the svg to the div
        // this.svg = slider.append("svg")
        //     .attr("width", this.svgWidth)
        //     .attr("height", this.svgHeight)

        this.years = [];
        for(let i=1916;i<=2016; i = i+5){
            this.years.push(i);
        }
    };



    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
     */
    update () {
        console.log("svgbounds", this.svgBounds);

        let x = d3.scaleLinear()
            .domain([1916, 2016])
            .range([0, this.svgWidth-this.margin.right])
            .clamp(true);

        let dispatch = d3.dispatch("sliderChange");

        // let slider = d3.select(".slider")
        //     .style("width", this.svgWidth);
        let slider = this.slider;


        let sliderTray = slider.append("div")
            .attr("class", "slider-tray");

        let sliderHandle = slider.append("div")
            .attr("class", "slider-handle");

        sliderHandle.append("div")
            .attr("class", "slider-handle-icon")


        slider.call(d3.drag()
            .on("start.interrupt", function() {
                dispatch.sliderChange(x.invert(d3.mouse(sliderTray.node())[0]));
                d3.event.sourceEvent.preventDefault();
            })
            .on("drag", function() {
                dispatch.sliderChange(x.invert(d3.mouse(sliderTray.node())[0]));
            }));

        dispatch.on("sliderChange.slider", function(value) {
            sliderHandle.style("left", x(value) + "px")
        });
        //Style the chart by adding a dashed line that connects all these years.
        //HINT: Use .lineChart to style this dashed line
        let textg = this.slider.append('g');


        //
        // //Append text information of each year right below the corresponding circle
        // //HINT: Use .yeartext class to style your text elements
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


    //******* TODO: EXTRA CREDIT *******
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