var width = 500,
    height = 300,
    padding = {top: 30, right: 30, bottom: 30, left: 30};

var dataset = [  
      [5, 20], [480, 90], [250, 50], [100, 33], [330, 95],  
      [410, 12], [475, 44], [25, 67], [85, 21], [220, 88]  
    ];

var xScale = d3.scale.linear()
      .domain([0, d3.max(dataset, function(d) { return d[0]; })])
      .range([0, width - padding.top - padding.bottom]);

var yScale = d3.scale.linear()
      .domain([0, d3.max(dataset, function(d) { return d[1]; })])
      .range([height - padding.top - padding.bottom, 0]);

var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom');

var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left')
      .ticks(5);

var svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
.append('g')
  .attr('transform', 'translate('+ padding.left +', 0)');

svg.selectAll('circle')
  .data(dataset)
  .enter()
  .append('circle')
  .attr('cx', function(d) { return xScale(d[0]); })
  .attr('cy', function(d) { return yScale(d[1]); })
  .attr('r', function(d) { return Math.sqrt(height - d[1]); });

svg.selectAll('text')
  .data(dataset)
  .enter()
  .append('text')
  .attr('x', function(d) { return xScale(d[0]); })
  .attr('y', function(d) { return yScale(d[1]); })
  .text(function(d) { return d[0] + ',' + d[1]; })
  .attr('font-family', 'sans-serif')
  .attr('font-size', '11px')
  .attr('fill', 'red');

svg.append('g')
  .attr('transform', 'translate(0, '+ (height - padding.top - padding.bottom) +')')
  .call(xAxis);

svg.append('g')
  .attr('transform', 'translate(0, 0)')
  .call(yAxis);
