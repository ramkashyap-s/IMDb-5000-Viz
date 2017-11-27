/**
 * Created by Kashyap on 11/26/2017.
 */
class NodeLinkv3{

    constructor(movies){
        //this.movies = movies;
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        this.nodeLink = d3.select("#nodeLink");

        //fetch the svg bounds
        this.svgBounds = this.nodeLink.node().getBoundingClientRect();
        this.svgWidth = (this.svgBounds.width - this.margin.right);
        this.svgHeight = 400;

        this.movies = movies;  //default 50 movies
        //console.log(this.data[0].movie_title);
        this.edges = [];
        this.nodes = [];
        this.directors = new Set([]);
        this.actors = new Set([]);
        this.movietitles = new Set([]);
    }

    update(selectedmovies){
        // let svgnodeLink = this.nodeLink.append("svg").attr("id","svgNL")
        //      .attr("width", this.svgWidth + this.margin.right*2)
        //      .attr("height", this.svgHeight);
        if(!selectedmovies){
            selectedmovies = this.movies.slice(0, 50) //default selection
        }

        selectedmovies.forEach(function(movie) {
            //edges from movie to director, actor1,2,3
            this.edges.push({"source": movie.movie_title.trim(), "target": movie.director_name.trim()})
            this.edges.push({"source": movie.movie_title.trim(), "target": movie.actor_1_name.trim()})
            this.edges.push({"source": movie.movie_title.trim(), "target": movie.actor_2_name.trim()})
            this.edges.push({"source": movie.movie_title.trim(), "target": movie.actor_3_name.trim()})
            //nodes data for title, director, actor1,2,3
            this.nodes.push({"id": movie.movie_title.trim(), "label": movie.movie_title.trim(), "group": 0, "color":"blue"});
            this.nodes.push({"id": movie.director_name.trim(), "label": movie.director_name.trim(), "group": 1, "color":"orange"});
            this.nodes.push({"id": movie.actor_1_name.trim(), "label": movie.actor_1_name.trim(), "group": 2, "color":"red"});
            this.nodes.push({"id": movie.actor_2_name.trim(), "label": movie.actor_2_name.trim(), "group": 2, "color":"red"});
            this.nodes.push({"id": movie.actor_3_name.trim(), "label": movie.actor_3_name.trim(), "group": 2, "color":"red"});
        },this)

        // let x = d3.nest()
        //     .key( (d) => { return d["id"]; } )
        //     .entries(this.nodes);


        console.log(this.nodes)
        console.log(this.edges)
        // this.nodes.forEach(function (node) {
        //     node.source
        // })


        //Set up tooltip
        let tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return  d.id + "</span>";
            })


        let svgnodeLink = d3.select('#canvas')
            .attr("width", this.svgWidth )
            .attr("height", this.svgHeight);

        svgnodeLink.call(tip);

        //Set up the force layout
        let force = d3v3.layout.force()
            .charge(-120)
            .linkDistance(15)
            .size([this.svgWidth, this.svgHeight]);

        //Append a SVG to the body of the html page. Assign this SVG as an object to svg
        let svg = d3.select("body").append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);

        


    }// close update()

}//close class