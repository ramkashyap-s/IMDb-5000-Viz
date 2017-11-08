
class MovieTable
{
    constructor(movies)
    {
        //Todo: List of movies passed needs to depend on the filter criteria specified by the user
        this.movies = movies.slice(0, 10);  //Just taking 10 movies for now
        this.tableHeaders = ["movie_title", "imdb_score", "budget", "gross"];
        this.columnsSortOrder = [ 0, 0, 0, 0 ];  // Click-counters for each of the 4 columns
    }

    create()
    {
        console.log(this.movies);

        let thead = d3.select("#moviesTable").select("thead");

        let theadColumns = thead.selectAll("th")
            .data(this.tableHeaders);



        // Adding sorting functionality to each column
        theadColumns
            .on("click", (d, i) => {

                // Every even click, sort all rows in ascending order of the chosen column's values
                if(this.columnsSortOrder[i] % 2 == 0)
                {
                    this.movies = (this.movies).slice().sort(function (a, b) {

                        if(a[d] < b[d])
                            return -1;
                        else if(a[d] > b[d])
                            return 1;
                        else
                            return 0;
                    });
                }
                else    // Every odd click, sort all rows in descending order of the chosen column's values
                {
                    this.movies = (this.movies).slice().sort(function (a, b) {

                        if(a[d] > b[d])
                            return -1;
                        else if(a[d] < b[d])
                            return 1;
                        else
                            return 0;
                    });
                }

                this.columnsSortOrder[i] += 1;
                this.update()   //Update the table contents with sorted data
            });

    }

    update()
    {
        let tbody = d3.select("#moviesTable").select("tbody");

        let tbodyRows = tbody.selectAll("tr")
            .data(this.movies);

        let tbodyRowsEnter = tbodyRows.enter().append("tr");
        tbodyRows.exit().remove();
        tbodyRows = tbodyRows.merge(tbodyRowsEnter);

        let tbodyColumns = tbodyRows.selectAll("td")
            .data( (d) => {
                return [
                    d["movie_title"], d["imdb_score"], d["budget"], d["gross"]
                ]
            } );

        let tbodyColumnsEnter = tbodyColumns.enter().append("td");
        tbodyColumns.exit().remove();

        let currentBudget = "";
        tbodyColumns = tbodyColumns.merge(tbodyColumnsEnter)
            .text( (d) => { return d; } )
            .attr("class", (d, i) => {
                if(i == 2)
                    currentBudget = d;

                if(i == 3)    // i = 3 for "Gross" column
                {
                    if(!d || !currentBudget || d.length == 0 || currentBudget.length == 0)
                    {
                        //console.log("Budget/Gross value not available");
                    }
                    else
                    {
                        if(parseInt(d) >= parseInt(currentBudget))  // If Gross >= Budget, then movie was profitable
                            return "table-success";
                        else
                            return "table-danger"
                    }
                }
            });
    }

}