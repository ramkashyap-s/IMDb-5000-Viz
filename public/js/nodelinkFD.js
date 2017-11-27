/**
 * Created by Kashyap on 11/26/2017.
 */
class NodeLinkFD{

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
        /*        (this.data).forEach(function (movie) {
         console.log(movie)
         this.edges.push([movie.movie_title.trim(), movie.director_name], [movie.movie_title.trim(), movie.actor_1_name],
         [movie.movie_title.trim(), movie.actor_2_name],[movie.movie_title.trim(), movie.actor_3_name]);
         this.nodes.push([movie.movie_title.trim(), {label: movie.movie_title.trim()}, {group:'0'}]);
         this.nodes.push([movie.director_name, {label: movie.director_name}, {group:'1'}]);//{color:'orange'}
         this.nodes.push([movie.actor_1_name, {label: movie.actor_1_name}, {group:'2'}]); //{color:'red'}
         this.nodes.push([movie.actor_2_name, {label: movie.actor_2_name},{group:'2'}]);
         this.nodes.push([movie.actor_3_name, {label: movie.actor_3_name}, {group:'2'}]);
         },this)
         */
    }

    update(selectedmovies){
        // let svgnodeLink = this.nodeLink.append("svg").attr("id","svgNL")
        //      .attr("width", this.svgWidth + this.margin.right*2)
        //      .attr("height", this.svgHeight);
        if(!selectedmovies){
            selectedmovies = this.movies.slice(0, 50) //default selection
        }

        // G.addNodesFrom(this.nodes);
        // G.addEdgesFrom(this.edges);
        (selectedmovies).forEach(function (selectedmovie) {
            this.movies.forEach(function(movie) {
                if(movie.movie_title.trim() == selectedmovie.movie_title.trim()){
                    this.edges.push([movie.movie_title.trim(), movie.director_name], [movie.movie_title.trim(), movie.actor_1_name],
                        [movie.movie_title.trim(), movie.actor_2_name],[movie.movie_title.trim(), movie.actor_3_name]);
                    G.addNodesFrom([movie.movie_title.trim()], {group:0, color:'blue', label: movie.movie_title.trim()});
                    G.addNodesFrom([movie.director_name], {group:1, color:'orange', label: movie.director_name});//
                    G.addNodesFrom([movie.actor_1_name], {group:2, color:'red', label: movie.actor_1_name}); //
                    G.addNodesFrom([movie.actor_2_name], {group:2, color:'red', label: movie.actor_2_name});
                    G.addNodesFrom([movie.actor_3_name], {group:2, color:'red', label: movie.actor_3_name});
                }
            },this)
        },this)


        let svgnodeLink = d3.select('#canvas')
            .attr("width", this.svgWidth )
            .attr("height", this.svgHeight);


        // Here we create our simulation, and give it some forces to apply to all the nodes:
        let simulation = d3.forceSimulation()
        // forceLink creates tension along each link, keeping connected nodes together
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }))
            // forceManyBody creates a repulsive force between nodes, keeping them away from each other
            .force("charge", d3.forceManyBody())
            // forceCenter acts like gravity, keeping the whole visualization in the middle of the screen
            .force("center", d3.forceCenter(width / 2, height / 2));



    }

}