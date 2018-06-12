;(function(){

	var Area = function(opt){

    this.animationTime = opt.animationTime; 
    this.graph = opt.graph;
    this.color = opt.color ? opt.color : ['#4099A7', '#D0817C'];
    this.strokeColor = opt.strokeColor;
    this.pointColor = opt.pointColor;
    this.strokeWidth = opt.strokeWidth ? opt.strokeWidth : 2;
    this.data = [[], []];
    this.area = [{}, {}];
    this.line = [{}, {}];
    this.dot = [{}, {}];
    this.unit = ['KB','MB','GB'];
    this.unitIndex = 0;
    this.axis = opt.axis;
    this.areaValue = opt.areaValue;
    this.max = 0;

    this.graph.append('g').attr('class', 'area-0');
    this.graph.append('g').attr('class', 'line-0');
    this.graph.append('g').attr('class', 'dot-0');
    this.graph.append('g').attr('class', 'area-1');
    this.graph.append('g').attr('class', 'line-1');
    this.graph.append('g').attr('class', 'dot-1');

	};

	Area.prototype = {

	  constructor: Area,

      bind: function(data) {
        var that = this;

        that.data[0].push({
          time: data['time'],
          value: data['net']['upload']
        });

        if(that.data[0][1]) {
          if(that.axis.xScale(that.data[0][1].time) < 0) {
            that.data[0].shift();
          }
        }


        that.data[1].push({
          time: data['time'],
          value: data['net']['download']
        }); 

        if(that.data[1][1]) {
          if(that.axis.xScale(that.data[1][1].time) < 0) {
            that.data[1].shift();
          }
        }

        that.max = d3.max([d3.max(that.data[1], function (d) {
        	return d.value;
        }),d3.max(that.data[0], function (d) {
        	return d.value;
        })], function (d){
        	return d;
        });

        


        for(var i = 0, len = that.area.length;i < len;i ++) {
          
          that.line[i] = that.graph.select('g.line-' + i).selectAll('path.line-' + i).data([that.data[i]]);
          that.dot[i] = that.graph.select('g.dot-' + i).selectAll('circle.dot-' + i).data(that.data[i]);
          that.area[i] = that.graph.select('g.area-' + i).selectAll('path.area-' + i).data([that.data[i]]);
         
        }

      },

      enter: function() {

        var that = this;

        for(var i = 0, len = that.area.length;i < len;i ++) {

          that.dot[i]
            .enter()
            .append('circle')
            .attr('class', 'dot-' + i)
            .attr('r', 3)
            .style('fill', function(d){
              if(that.pointColor) {
                return that.pointColor[i];
              } else {
                return that.color[i];
              }
            });

          that.area[i]
            .enter()
            .append('path')
            .attr('class', 'area-' + i)
            .style('fill', function(d){
              return that.color[i];
            })
            .style('opacity', function(d){
              if(that.strokeColor) {
                if(i == 0) {
                  return 0.6;
                } else {
                  return 0.35;
                }
              } else {
                return 0.4;
              }

              
            });

          that.line[i]
            .enter()
            .append('path')
            .attr('class', 'line-' + i)
            .style('stroke', function(d){
              if(that.strokeColor) {
                return that.strokeColor[i];
              } else {
                return that.color[i];
              }
              
            })
            .style('stroke-width', function(d, i){
              return that.strokeWidth;
            });

          
        }

      },

      render: function() {

        var that = this;

        that.areaDraw = d3.svg.area()
          .x(function(d){
            return that.axis.xScale(d['time']);
          })
          .y0(that.axis.yScale(0) + that.axis.padding.top)
          .y1(function(d){
            return that.axis.yScale(d['value']) + that.axis.padding.top;
          }); 

        that.lineDraw = d3.svg.line()
          .x(function(d){
            return that.axis.xScale(d['time']);
          })
          .y(function(d){
            return that.axis.yScale(d['value']) + that.axis.padding.top;
          });

        for(var i = 0, len = that.area.length;i < len;i ++) {
          that.area[i]
            .attr('d', that.areaDraw);

          that.line[i]
            .attr('d', that.lineDraw);

          that.dot[i]
            .attr('cx', function (d) {
              return that.axis.xScale(d['time']);
            })
            .attr('cy', function (d) {
              return that.axis.yScale(d['value']) + that.axis.padding.top;
            });
        }

      },

      update : function() {
        var that = this;

        for(var i = 0, len = that.area.length;i < len;i ++) {
          that.area[i]
            .transition()
            .duration(1000)
            .attr('d', that.areaDraw);

          that.line[i]
            .transition()
            .duration(1000)
            .attr('d', that.lineDraw);

          that.dot[i]
            .transition()
            .duration(1000)
            .attr('cx', function (d) {
              return that.axis.xScale(d['time']);
            })
            .attr('cy', function (d) {
              return that.axis.yScale(d['value']) + that.axis.padding.top;
            });
        }
      },

      exit: function() {
        var that = this;

        for(var i = 0, len = that.area.length;i < len;i ++) {
          that.area[i]
            .exit()
            .remove();

          that.dot[i]
            .exit()
            .remove();

        }
      },

      draw: function(data) {

        this.bind(data);
        this.enter();
        this.render();
        this.exit();

      }
		
	}

	window.Area = Area;

})();