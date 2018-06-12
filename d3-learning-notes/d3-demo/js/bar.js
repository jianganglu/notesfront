;(function(){

	var Bar = function(opt){

    this.color = opt.color;
    this.axis = opt.axis;
    this.isGrad = opt.isGrad ? opt.isGrad : false;
    this.animationTime = opt.animationTime;
    this.graph = this.axis.graph;
    
	};

	Bar.prototype = {

	    constructor: Bar,

      bind: function(data) {
        var that = this;

        
        that.rect = that.graph.selectAll('rect').data(data);
        that.text = that.graph.selectAll('text.label').data(data);

        if(that.isGrad) {
          var linearGrad = that.graph.append('defs')
            .append('linearGradient')
            .attr('id', 'rectGard')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');

          linearGrad.append('stop')
            .attr('offset', '0%')
            .style('stop-color', that.isGrad[0]);

          linearGrad.append('stop')
            .attr('offset', '100%')
            .style('stop-color', that.isGrad[1]);
        }
      },

      enter: function() {
        var that = this;
        that.rect
          .enter()
          .append('rect')
          .attr("class", "rect")
          .style("fill", function (d, i){
            if(that.isGrad) {
              return "url(#rectGard)";
            } else {
              return that.color;  
            }
            
          });

        that.text
          .enter()
          .append('text')
          .attr('class', 'label')
          .attr('x', function (d, i) {
            return that.axis.xScale(d.name) + that.axis.padding.left + that.axis.xScale.rangeBand() / 2;
          })
          .style({
            'text-anchor' : 'middle',
            'font-weight' : 'normal'
          })
          .style('fill', function (d){
            if(that.isGrad) {
              return that.isGrad[0];
            } else {
              return that.color;  
            }
          });
      },

      render: function() {

        var that = this;
        that.rect
          .transition()
          .duration(that.animationTime)
          .attr('x', function (d, i) {
            return that.axis.xScale(d.name) + that.axis.padding.left;
          })
          .attr('y', function (d, i) {
            return that.axis.yScale(d.usage) + that.axis.padding.top;
          })  
          .attr('width', that.axis.xScale.rangeBand())
          .attr('height', function (d, i) {  
            return that.axis.height - that.axis.yScale(d.usage) - that.axis.padding.top - that.axis.padding.bottom;
          });

        that.text
          .text(function (d) {
            return d.usage;
          })
          .transition()
          .duration(that.animationTime)
          .attr('x', function (d, i) {
            return that.axis.xScale(d.name) + that.axis.padding.left + that.axis.xScale.rangeBand() / 2;
          })
          .attr('y', function (d, i) {
            return that.axis.yScale(d.usage) + that.axis.padding.top - 5;
          });
      },

      update: function() {
        var that = this;

        if(that.rect) {
          that.render();
        }

      },

      exit: function() {
        var that = this;

        that.rect
          .exit()
          .remove();
      },

      draw: function(data) {

        this.bind(data);
        this.enter();
        this.render();
        this.exit();

      }
		
	}

	window.Bar = Bar;

})();