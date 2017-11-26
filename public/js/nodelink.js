class NodeLink{

    constructor(nodes){
        //this.movies = movies;
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        this.nodeLink = d3.select("#nodeLink");

        //fetch the svg bounds
        this.svgBounds = this.nodeLink.node().getBoundingClientRect();
        this.svgWidth = (this.svgBounds.width - this.margin.left - this.margin.right);
        this.svgHeight = 400;

        this.data = nodes.slice(0, 50);  //Just taking 11 movies for now
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

    update(){
       // let svgnodeLink = this.nodeLink.append("svg").attr("id","svgNL")
       //      .attr("width", this.svgWidth + this.margin.right*2)
       //      .attr("height", this.svgHeight);

        let svgnodeLink = d3.select('#canvas')
              .attr("width", this.svgWidth + this.margin.right*2)
              .attr("height", this.svgHeight);
        console.log("height", this.svgHeight);
        let G = new jsnx.Graph();

        // G.addNodesFrom(this.nodes);
        // G.addEdgesFrom(this.edges);
        (this.data).forEach(function (movie) {
            this.edges.push([movie.movie_title.trim(), movie.director_name], [movie.movie_title.trim(), movie.actor_1_name],
                [movie.movie_title.trim(), movie.actor_2_name],[movie.movie_title.trim(), movie.actor_3_name]);
            G.addNodesFrom([movie.movie_title.trim()], {group:0, color:'blue', label: movie.movie_title.trim()});
            G.addNodesFrom([movie.director_name], {group:1, color:'orange', label: movie.director_name});//
            G.addNodesFrom([movie.actor_1_name], {group:2, color:'red', label: movie.actor_1_name}); //
            G.addNodesFrom([movie.actor_2_name], {group:2, color:'red', label: movie.actor_2_name});
            G.addNodesFrom([movie.actor_3_name], {group:2, color:'red', label: movie.actor_3_name});
        },this)

         G.addEdgesFrom(this.edges);


        let color = d3v3.scale.category20();
        jsnx.draw(G, {
            element: '#canvas',
            layoutAttr: {
                charge: -20,
                linkDistance: 20
            },
            nodeAttr: {
                r: function(d){
                    if(d.data.group == 0)
                    return 5;
                    else return 4;
                }
                //title: function(d) { return d.label;}

            },

            nodeStyle: {
                fill: function(d) {
                    //console.log((d))
                    //return color(d.data.group);
                    return d.data.color;
                },
                stroke: 'none'
            },
            edgeStyle: {
                fill: '#999'
            }
        });
/*
        let G = new jsnx.Graph();

        G.addNodesFrom([1,2,3,4], {group:0});
        G.addNodesFrom([5,6,7], {group:1});
        G.addNodesFrom([8,9,10,11], {group:2});

        G.addPath([1,2,5,6,7,8,11]);
        G.addEdgesFrom([[1,3],[1,4],[3,4],[2,3],[2,4],[8,9],[8,10],[9,10],[11,10],[11,9]]);

        var color = d3v3.scale.category20();
        jsnx.draw(G, {
            element: '#demo-svg',
            layoutAttr: {
                charge: -120,
                linkDistance: 20
            },
            nodeAttr: {
                r: 5,
                title: function(d) { return d.label;}
            },
            nodeStyle: {
                fill: function(d) {
                    //console.log(d);

                    return color(d.data.group);
                },
                stroke: 'none'
            },
            edgeStyle: {
                fill: '#999'
            }
        });
*/



    }






}