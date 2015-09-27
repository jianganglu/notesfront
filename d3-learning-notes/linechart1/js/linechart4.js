/**
 * @name linechart4
 * @desc 线性图
 * @auth Jiangang Lu
 * @date 2015/09/24
 */

var margin = {top: 30, right: 30, bottom: 30, left: 30},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var data = [30, 40, 50, 60];

var svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height)
    .append('g')
      .attr('transform', 'translate('+ margin.left +', '+ margin.top +')');

var xScale = d3.scale.ordinal()
      .domain(d3.range(3))
      .rangeBands([0, 100]);

var yScale = d3.scale.linear()
      .domain([1.3,4.5])
      .rangeRound([height, 0]);

var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
var yAxis = d3.svg.axis().scale(yScale).orient('left');

svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0, '+ (height - margin.top * 2) +')').call(xAxis);
svg.append('g').attr('class', 'y axis').call(yAxis);