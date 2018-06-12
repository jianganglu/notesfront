/*//////////////////////////////////////////////////////////
////////////////// Set up the Data /////////////////////////
//////////////////////////////////////////////////////////*/

var NameProvider = ["Apple","HTC"];
  
var matrix = [
[2.6899,0.8859,0.0554,0.443,2.5471,2.4363,0.5537,2.5471], /*Apple 19.1584*/
[19.1107,11.8272,0,0.4983,1.1074,1.052,0.2215,0.4983], /*HTC 5.3154*/
// [0.0554,0.2769,0.2215,0.2215,0.3876,0.8306,0.0554,0.3322], /*Huawei 2.3811*/
// [0.0554,0.1107,0.0554,1.2182,1.1628,0.6645,0.4983,1.052], /*LG 4.8173*/
// [0.2215,0.443,0,0.2769,10.4097,1.2182,0.4983,2.8239], /*Nokia 15.8915*/
// [1.1628,2.6024,0,1.3843,8.7486,16.8328,1.7165,5.5925], /*Samsung 38.0399*/
// [0.0554,0.4983,0,0.3322,0.443,0.8859,1.7719,0.443], /*Sony 4.4297*/
// [0.2215,0.7198,0,0.3322,1.6611,1.495,0.1107,5.4264] /*Other 9.9667*/
];
/*Sums up to exactly 100*/

var colors = ["#0d476a","#05a4c5","#EC1D25","#C8125C","#008FC8","#10218B","#134B24","#0b4764"];

/*Initiate the color scale*/
var fill = d3.scale.ordinal()
    .domain(d3.range(NameProvider.length))
    .range(colors);

/*//////////////////////////////////////////////////////////
/////////////// Initiate Chord Diagram /////////////////////
//////////////////////////////////////////////////////////*/

var margin = {top: 20, right: 25, bottom: 20, left: 25},
  width = 700 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom,
    innerRadius = Math.min(width, height) * .1,
    outerRadius = innerRadius * 1.14;

/*Initiate the SVG*/
var svg = d3.select("#chart").append("svg:svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("svg:g")
    .attr("transform", "translate(" + (margin.left + width / 2) + "," + (margin.top + height / 2) + ")");

  
var chord = d3.layout.chord()
    .padding(.08)
    .sortSubgroups(d3.descending) /*sort the chords inside an arc from high to low*/
    .sortChords(d3.descending) /*which chord should be shown on top when chords cross. Now the biggest chord is at the bottom*/
  .matrix(matrix);
  

/*//////////////////////////////////////////////////////////
////////////////// Draw outer Arcs /////////////////////////
//////////////////////////////////////////////////////////*/

var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);
  
var g = svg.selectAll("g.group")
  .data(chord.groups)
  .enter().append("svg:g")
  .attr("class", function(d) {return "group " + NameProvider[d.index];});
  
g.append("svg:path")
    .attr("class", "arc")
    .style("stroke", function(d) { return fill(d.index); })
    .style("fill", function(d) { return fill(d.index); })
    .attr("d", arc)
    .style("opacity", 0)
    .transition().duration(1000)
    .style("opacity", 0.4);
