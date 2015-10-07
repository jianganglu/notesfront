var svg = d3.select('body').append('svg')
  .attr('width', '100%')
  .attr('height', '100%');

svg.append('text')
  .text('A picture!')
  .attr({
    x: 10,
    y: 150,
    'text-anchor': 'start'
  });

svg.append('line')
  .attr({
    x1: 10,
    y1: 10,
    x2: 100,
    y2: 100,
    stroke: 'blue',
    'stroke-width': 3
  });

svg.append('rect')
  .attr({
    x: 200,
    y: 50,
    width: 300,
    height: 400
  });

svg.select('rect')
  .attr({
    stroke: 'green',
    'stroke-width': 0.5,
    fill: 'white',
    rx: 20,
    ry: 40
  });

svg.append('circle')
  .attr({
    cx: 350,
    cy: 250,
    r: 100,
    fill: 'green',
    'fill-opacity': 0.5,
    stroke: 'steelblue',
    'stroke-width': 2
  });

svg.append('ellipse')
  .attr({
    cx: 350,
    cy: 250,
    rx: 150,
    ry: 70,
    fill: 'green',
    'fill-opacity': 0.3,
    stroke: 'steelbule',
    'stroke-width': 0.7
  });

svg.append('ellipse')
  .attr({
    cx: 350,
    cy: 250,
    rx: 20,
    ry: 70
  });

svg.selectAll('ellipse, circle')
  .attr('transform', 'translate(150, 0) scale(1.2) translate(-70, 0) rotate(-45, '+ (350/1.2) +', '+ (250/1.2) +') skewY(20) ');