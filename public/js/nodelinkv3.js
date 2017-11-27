/**
 * Created by Kashyap on 11/26/2017.
 */
class NodeLinkv3{

    constructor(movies){
        //this.movies = movies;
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        this.nodeLink = d3v3.select("#nodeLink");

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
        let that = this;
        //Set up tooltip
        let tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return  d.id + "</span>";
            })

        //setting up width and height of svg
        let svgnodeLink = d3v3.select('#canvas')
            .attr("width", this.svgWidth )
            .attr("height", this.svgHeight);

        //calling tool tip
        // svgnodeLink.call(tip);

        //Set up the force layout
        let force = d3v3.layout.force()
            .size([this.svgWidth, this.svgHeight])
            .charge(-30)
            .linkDistance(15);


        // default data for node links
        if(!selectedmovies){
            selectedmovies = this.movies.slice(0, 50) //default selection
        }

        //creating objects for nodes, edges
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


        //Creates the graph data structure out of node, edge data
        force.nodes(that.nodes)
            .links(that.edges)
            .start();

        //Create all the line svgs but without locations
        let link = svgnodeLink.selectAll(".link")
            .data(this.edges)
            .enter().append("line")
            .attr("class", "link")

        //Do the same with the circles for the nodes - no locations
        let node = svgnodeLink.selectAll(".node")
            .data(this.nodes)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 5)
            .attr("fill", function (d) {
                //console.log(d)
                // return color(d.group);
                return d.color;
            })
            .call(force.drag)
            .call(tip)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates
        // which this code is using to update the attributes of the SVG elements
        force.on("tick", function () {
            link.attr("x1", function (d) {
                return d.source.x;
            })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });

            node.attr("cx", function (d) {
                return d.x;
            })
                .attr("cy", function (d) {
                    return d.y;
                });
        });


    }// close update()

}//close class