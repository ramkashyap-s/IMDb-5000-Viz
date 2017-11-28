/**
 * Created by Kashyap on 11/26/2017.
 */
class NodeLinkFD{

    constructor(movies){
        //this.movies = movies;
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        this.nodeLink = d3.select("#nodeLink");

        this.legend = d3.select("#legend");
        this.legendHeight = 50;

        //fetch the svg bounds
        this.svgBounds = this.nodeLink.node().getBoundingClientRect();
        this.svgWidth = (this.svgBounds.width - this.margin.right);
        this.svgHeight = 550;

        this.movies = movies;  //default 50 movies
        //console.log(this.data[0].movie_title);
        this.edges = [];
        this.nodes = [];
        // this.directors = new Set([]);
        // this.actors = new Set();
        // this.movietitles = new Set([]);
    }

    update(selectedmovies){

        let that = this;
        // create legend
        let svgLegend = this.legend.select("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.legendHeight);

        //let gLegend = svgLegend.append("g");

        let colors = [{"color": "red" , "role" : "Actor"},{"color": "orange", "role" : "Director"},
                        {"color": "blue" , "role" : "Movie"},{"color": "purple", "role" : "Actor and Director"}];

        let legendCircles = svgLegend.enter().append("circle")
            .data(colors)
            .attr("fill", function (d) {
                return d.color;
            })
            .attr("cx", function (d,i) {
                return i * (that.svgWidth/8) + that.margin.left;
            })
            .attr("cy", "50%")
            .attr("r", 5)
            .attr("class", "legend");

        let labels = svgLegend.enter().append("text")
            .data(colors)
            .attr("x", function (d,i) {
                return i * (that.svgWidth/8) + that.margin.left*1.5;
            })
            .attr("y", "50%")
            .text("text", function (d) {
                return d.role;
            })
            .attr("class", "legend");





        if(!selectedmovies){
            selectedmovies = this.movies.slice(0, 70) //default selection
        }

        selectedmovies.forEach(function(movie) {
            let sameActorDirector = 0;
            //check for this current movie if actor and director is the same person and decrement their degree
            if(movie.director_name.trim() === movie.actor_1_name.trim() ||
                movie.director_name.trim() === movie.actor_2_name.trim() ||
                movie.director_name.trim() === movie.actor_3_name.trim()){
                sameActorDirector = 1;
                // return (that.nodes).some(function(elem){
                //     if(elem.id === name) {
                //         elem.degree = elem.degree - 1 ;
                //         // elem.color = "purple";
                //         // elem.group = 4;
                //     }
                // })
            }

            //function to check if a node exists and increment degree
            function nodeExists(name, group) {
                return (that.nodes).some(function(elem) {
                    //check if a person is both actor and director from the node list
                    // and assign it a different color and group
                    if(elem.id === name && elem.group != group){
                        // if(sameActorDirector == 1){
                        //     elem.degree = elem.degree - 1;
                        //     sameActorDirector = 0;
                        //     console.log(group)
                        //     console.log(elem);
                        // }
                        // else{
                        //     elem.degree++;
                        // }
                        elem.degree++;
                        elem.color = "purple";
                        elem.group = 4;
                        return true;
                    }
                    else if(elem.id === name){
                            elem.degree++;
                        return true;
                    }
                    else
                        return false;
                });
            }

            //if director doesn't exists add to nodes list
            let directorDegree = nodeExists(movie.director_name.trim(), 1);
            if(!directorDegree){
                this.nodes.push({"id": movie.director_name.trim(), "group": 1, "color":"orange", "degree": 1});
            }

            //if actor doesn't exists add to nodes list
            let actor1Degree = nodeExists(movie.actor_1_name.trim(), 2);
            if(!actor1Degree){
                this.nodes.push({"id": movie.actor_1_name.trim(), "group": 2, "color":"red", "degree": 1});
            }

            //if actor doesn't exists add to nodes list
            let actor2Degree = nodeExists(movie.actor_2_name.trim(), 2);
            if(!actor2Degree){
                this.nodes.push({"id": movie.actor_2_name.trim(), "group": 2, "color":"red", "degree": 1});
            }

            //if actor doesn't exists add to nodes list
            let actor3Degree = nodeExists(movie.actor_3_name.trim(), 2);
            if(!actor3Degree){
                this.nodes.push({"id": movie.actor_3_name.trim(), "group": 2, "color":"red", "degree": 1});
            }

            //edges from movie to director, actor1,2,3
            this.edges.push({"source": movie.movie_title.trim(), "target": movie.director_name.trim()});
            this.edges.push({"source": movie.movie_title.trim(), "target": movie.actor_1_name.trim()});
            this.edges.push({"source": movie.movie_title.trim(), "target": movie.actor_2_name.trim()});
            this.edges.push({"source": movie.movie_title.trim(), "target": movie.actor_3_name.trim()});

            //nodes data for title, director, actor1,2,3
            this.nodes.push({"id": movie.movie_title.trim(),  "group": 0, "color":"blue", "degree": 1});




        },this);



        // console.log(this.nodes)
        // console.log(this.edges)

        //Scale for setting up size of the node based on the degree
        // let rscale = d3.scaleLinear().domain([]).range([]);

        //Set up tooltip
        let tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                // if (d.group == 1){
                //     return  (d.id).slice(1) + ": Degree" + d.degree + "</span>";
                // } else
                if(d.group != 0 && d.degree > 1){
                    return  d.id + ": Degree" + d.degree + "</span>";
                }
                else{
                    return  d.id + "</span>";
                }
            });

        //setting up svg
        let svgnodeLink = d3.select('#canvas')
            .attr("width", this.svgWidth )
            .attr("height", this.svgHeight);

        //calling tool-tip
        svgnodeLink.call(tip);

        // Here we create our simulation, and give it some forces to apply to all the nodes:
        let simulation = d3.forceSimulation()
        // forceLink creates tension along each link, keeping connected nodes together
            .force("link", d3.forceLink()
                .id(function (d) {
                return d.id;
            }))
            // forceManyBody creates a repulsive force between nodes, keeping them away from each other
            .force("charge", d3.forceManyBody().strength(-20))
            // forceCenter acts like gravity, keeping the whole visualization in the middle of the screen
            .force("center", d3.forceCenter(this.svgWidth / 2, this.svgHeight / 2))
            .force("forceX", d3.forceX())
            .force("forceY", d3.forceY())
            // .force("collide", d3.forceCollide([20]));
            // .force("collide", d3.forceCollide());
            .force("collide",d3.forceCollide( function(d){return (d.degree + 6) })); //.iterations(16)

        // First we create the links in their own group that comes before the node group;
        // using groups like layers, the circles will always be on top of the lines

        svgnodeLink.selectAll(".links").remove();

        let linkLayer = svgnodeLink.append("g")
            .attr("class", "links");

        // Now let's create the lines
        let links = linkLayer.selectAll("line")
            .data(this.edges)


        let linksEnter = links.enter().append("line");

        links.exit().remove();

        links = links.merge(linksEnter);

        links.attr("stroke-width", function (d) {
            // let sourcewt = that.nodes.getOwnProperty(d.source) ;
            // let targetwt = that.nodes.getOwnProperty(d.target) ;
            // sourcewt = (sourcewt > targetwt) ? sourcewt : targetwt;
            return 1;
        })

        // Now we create the node layer, and the nodes inside it
        svgnodeLink.selectAll(".nodes").remove();

        let nodeLayer = svgnodeLink.append("g")
            .attr("class", "nodes");

        /*
        let nodeLayer = svgnodeLink.selectAll(".nodes");

        let nodeLayerEnter = nodeLayer.enter().append("g");

        nodeLayer.exit().remove();

        nodeLayer = nodeLayerEnter.merge(nodeLayer)
            .attr("class", "nodes");
        */

        let nodes = nodeLayer.selectAll("circle")
            .data(this.nodes);

        let nodesEnter = nodes.enter().append("circle");

        nodes.exit().remove();

        nodes = nodes.merge(nodesEnter);

        nodes
            .attr("r", function(d){
                return (4 + d.degree);
            })
            .attr("fill", function (d) {
                //console.log(d)
                // return color(d.group);
                 return d.color;
            })
            // This part adds event listeners to each of the nodes; when you click,
            // move, and release the mouse on a node, each of these functions gets called
            // (we've defined them at the end of the file)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
                .call(tip)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);



        // simulation.force("center").x(this.svgWidth / 2).y(this.svgHeight / 2);
        //
        // simulation.force("collide")
        //     .strength(1)
        //     // .radius(function(v) {
        //     //     return scales.radius(v.degree) + 2;
        //     // });
        //
        // simulation.force("charge").strength(-12);


        // Now that we have the data, let's give it to the simulation...
        simulation.nodes(this.nodes);

        // The tension force (the forceLink that we named "link" above) also needs to know
        // about the link data that we finally have
        simulation.force("link")
            .links(this.edges)
            .distance(10);

        // Finally, let's tell the simulation how to update the graphics
        simulation.on("tick", function () {
            // Every "tick" of the simulation will create / update each node's coordinates;
            // we need to use those coordinates to move the lines and circles into place
            links
                .attr("x1", function (d) {
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

            nodes
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                });
        });

        function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

        function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

        function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    }// close update()

}//close class