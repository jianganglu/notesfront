var width = 500,
    height = 50;
var data = [5, 10, 15, 20, 25];

d3.select('body').append('svg')
  .attr('width', width)
  .attr('height', height)
  .selectAll('circle').data(data)
  .enter()
  .append('circle')
  .attr('cx', function(d, i) { return (i * 50 + 25); })
  .attr('cy', function(d) { return (height / 2); })
  .attr('r', function(d) { return d; })
  .attr('fill', 'black'); 