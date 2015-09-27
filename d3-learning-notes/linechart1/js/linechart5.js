/**
 * @name linechart5
 * @desc 更自由的条形图
 * @auth Jiangang Lu
 * @date 2015/09/27
 */

var width = 500,  
    height = 100,
    barPadding = 1;  
   
var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

var svg = d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height);

svg.selectAll('rect')
  .data(dataset)
  .enter()
  .append('rect')
  .attr('x', function(d, i) { return i * (width / dataset.length); }) //间隙的宽度固定，总宽-空白宽=条宽。条宽取决于总宽（w / dataset.length - barPadding），总宽取决于计算表达式(w / dataset.length）
  .attr('width', function(d, i) { return (width / dataset.length - barPadding); })
  .attr('y', function(d) { return (height - d * 4); })
  .attr('height', function(d) { return d * 4; })
  .attr('fill', function(d) { return 'rgb(0, 0, '+ (d * 10) +')'; });

svg.selectAll('text')
  .data(dataset)
  .enter()
  .append('text')
  .attr('x', function(d, i) { return i * (width / dataset.length) + (width / dataset.length - barPadding) / 2; })
  .attr('y', function(d) { return (height - d * 4 + 14); })
  .text(function(d) { return d * 4; })
  .attr('text-anchor', 'middle')
  .attr('font-family', 'sans-serif')
  .attr('font-size', '11px')
  .attr('fill', 'white')

