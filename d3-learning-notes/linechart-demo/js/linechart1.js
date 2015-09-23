/**
 * @name linechart1
 * @desc 线性图表
 * @auth Jiangang Lu
 * @date 2015/09/12
 */
var width = 500,
height = 250,
margin = {
  left: 50,
  top: 30,
  right: 50,
  bottom: 30
},
g_width = width - margin.left - margin.right,
g_height = height - margin.top - margin.bottom;

// 在container里添加svg，并定义宽高
var svg = d3.select('#container')
.append('svg')
// width, height
.attr('width', width) // attribute
.attr('height', height)

// 在svg里添加g
var g = d3.select('svg')
.append('g') // group
.attr('transform', 'translate('+ margin.left +', '+ margin.top +')')

// 绘制曲线
var data = [1, 3, 5, 7, 8, 4, 3, 7];

var scale_x = d3.scale.linear()
.domain([0, data.length - 1])
.range([0, g_width])
var scale_y = d3.scale.linear()
.domain([0, d3.max(data)])
.range([g_height, 0])

var line_generator = d3.svg.line()
.x(function(d, i) { return scale_x(i); }) // 0, 1, 2...
.y(function(d) { return scale_y(d); }) //1, 3, 5...
.interpolate('cardinal')

g
.append('path')
.attr('d', line_generator(data)) // path data

var x_axis = d3.svg.axis().scale(scale_x),
y_axis = d3.svg.axis().scale(scale_y).orient('left')

// 坐标系绘制
g
.append('g')
.call(x_axis)
.attr('transform', 'translate(0, '+ g_height +')')
g
.append('g')
.call(y_axis)

// 添加文本区域
g
.append('text')
.text('Price($)')
.attr('transform', 'rotate(-90)')
.attr('text-anchor', 'end')
.attr('dy', '1em')
