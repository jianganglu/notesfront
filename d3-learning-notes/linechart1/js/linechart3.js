/**
 * @name linechart3
 * @desc 双线性图表
 * @auth JiangangLu
 * @date 2015/09/23
 */

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([-width / 2, width / 2])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([-height / 2, height / 2])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickSize(-width);

var zoom = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([1, 32])
    .on("zoom", zoomed);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

svg.append("rect")
    .attr("width", width)
    .attr("height", height);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

function zoomed() {
  svg.select(".x.axis").call(xAxis);
  svg.select(".y.axis").call(yAxis);
}

// var margin = {top: 200, right: 10, bottom: 200, left: 10},
//     width = 960 - margin.right - margin.left,
//     height = 500 - margin.top - margin.bottom;

// var x = d3.scale.linear()
//     .domain([.05, .95])
//     .range([0, width]);

// var y = d3.scale.linear()
//     .range([0, height]);

// var svg = d3.select("body").append("svg")
//     .attr("width", width + margin.right + margin.left)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// svg.append("rect")
//     .attr("class", "grid-background")
//     .attr("width", width)
//     .attr("height", height);

// svg.append("g")
//     .attr("class", "grid")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.svg.axis().scale(x).ticks(20).tickSize(-height))
//   .selectAll(".tick")
//     .data(x.ticks(10), function(d) { return d; })
//   .exit()
//     .classed("minor", true);

// svg.append("g")
//     .attr("class", "axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.svg.axis().scale(x).ticks(10));