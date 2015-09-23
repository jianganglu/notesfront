/**
 * @name barchart-horizontal
 * @desc 使用数据文件
 * @auth Jiangang Lu
 * @date 2015/09/13
 */

d3.csv('./data/data.csv', type, function(data) {
  console.log(data);

  var bar_height = 50,
  bar_padding = 10,
  svg_height = (bar_height + bar_padding) * data.length,
  svg_width = 500;


var scale = d3.scale.linear()
.domain([0, d3.max(data, function(d) { return d.population; })])
.range([svg_height, 0])

var svg = d3.select('#container')
.append('svg')
.attr({
  'width': svg_width,
  'height': svg_height
})

var bar = svg.selectAll('g')
.data(data)
.enter()
.append('g')
.attr('transform', function(d, i) { return 'translate('+ i * (bar_width + bar_padding) +', 0)'; })

bar.append('rect')
.attr({
  'y': function(d) { return scale(d.population); },
  'width': bar_width,
  'height': function(d) { return svg_height - scale(d.population); }
})
.style('fill', 'steelblue')

bar.append('text')
.text(function(d) { return d.year; })
.attr({
  'y': function(d) { return scale(d.population) },
  'x': bar_width / 2,
  'dy': 15,
  'text-anchor': 'middle'
})

})

function type(d) {
  d.population = +d.population;
  return d;
}