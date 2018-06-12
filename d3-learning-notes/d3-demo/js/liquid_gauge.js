;(function(){

	var LiquidGauge = function(opt){

    this.animationTime = opt.animationTime; 
    this.graph = opt.graph;
    this.radius = opt.radius;
    this.circleX = opt.circleX;
    this.circleY = opt.circleY;
    this.title = opt.title;

    this.waveCount = opt.waveCount ? opt.waveCount : 2;
    this.waveHeight = opt.waveHeight ? opt.waveHeight : 0.05;

    this.color = opt.color ? opt.color : '#FF7777';
    this.thickness = opt.thickness ? opt.thickness : this.radius / 20;
    this.fillGap = opt.fillGap ? opt.fillGap : this.radius / 20;

    this.pane = opt.pane;
    this.unit = opt.unit ? opt.unit : '';

    this.isDraw = false;

	};

	LiquidGauge.prototype = {

	    constructor: LiquidGauge,

      init: function() {
        var that = this;

        that.group = that.graph.append('g').attr('transform', 'translate(' + that.circleX + ',' + that.circleY + ')');

        var circle = d3.svg.arc()
          .startAngle(0)
          .endAngle(2 * Math.PI)
          .outerRadius(that.radius)
          .innerRadius(that.radius - that.thickness);
          
        //外层容器
        that.gauge = that.group.append('path')
          .attr('d', circle)
          .style('fill', that.color)
          .attr('transform', 'translate(' + that.radius + ',' + that.radius + ')');

        //控制波浪高度
        that.waveHeightScale = d3.scale.linear().range([0,that.waveHeight,0]).domain([0,50,100]);

        //标题
        that.text = that.group.append('text')
          .text(that.title)
          .attr('fill', that.color)
          .attr('transform', 'translate(' + that.radius + ',' + that.radius / 1.5 + ')')
          .style('text-anchor', 'middle')
          .style('font-size', that.radius / 5 + 'px');

        that.info = that.pane.append('div').attr('class', 'info').style('top', (that.radius - 10) + 'px').style('left', (that.radius * 2.7) + 'px').style('color', that.color);

        var html = '<h4>当前使用量</h4>' +
                      '<span class="used"></span>' + 
                      '<span class="unit"></span>' + 
                      '&nbsp/&nbsp' +
                      '<span class="total"></span>' + 
                      '<span class="unit"></span>';


        that.info.html(html);

      },
     

      draw: function(data) {
        var that = this;

        that.data = [];
        that.isDraw = true;
        for(var i = 0; i <= 40 * (this.waveCount + 1); i++){
          that.data.push({x: i / (40 * (this.waveCount + 1)), y: (i / (40))});
        }

        that.innerRadius = that.radius - that.thickness - that.fillGap;

        that.waveScaleX = d3.scale.linear().range([0, that.radius * 3]).domain([0,1]);
        that.waveScaleY = d3.scale.linear().range([0, that.waveHeightScale(data['usage']) * that.innerRadius]).domain([0, 1]);

        that.waveAnimateScale = d3.scale.linear().range([0, that.radius]).domain([0,1]);

        var clipArea = d3.svg.area()
          .x(function(d){
            return that.waveScaleX(d.x);
          })
          .y0(function(d) { 
            return that.innerRadius * 2 * (1 - data['usage'] / 100) + that.waveScaleY(Math.sin(Math.PI * 2 * (1 - that.waveCount) + d.y * 2 * Math.PI));
          })
          .y1(function(d) {
             return (that.radius * 2 + that.waveHeightScale(data['usage']) * that.radius);
          });

        that.waveGroup = that.group.append('defs')
          .append('clipPath')
          .attr('id', 'clipWave-' + that.title)
          .attr('transform','translate('+ (-that.radius) + ',0)');

        that.wave = that.waveGroup.append('path')
          .datum(that.data)
          .attr('d', clipArea)
          .attr('T', 0);

        that.circleGroup = that.group.append('g')
          .attr("clip-path", "url(#clipWave-" + that.title + ")");


        that.gradGroup = that.circleGroup.append('defs')
          .append('radialGradient')
          .attr('id', 'grad-' + that.title)
          .attr('cx', '50%')
          .attr('cy', 1 - data['usage'] / 2 + '%')
          .attr('r', '150%');

        that.gradGroup.append('stop')
          .attr('offset', '0%')
          .style('stop-color', that.color)
          .style('stop-opacity', 0.2);

        that.gradGroup.append('stop')
          .attr('offset', '100%')
          .style('stop-color', that.color)
          .style('stop-opacity', 0.9);


        that.circleGroup.append('circle')
          .attr('cx', that.radius)
          .attr('cy', that.radius)
          .attr('r', that.innerRadius)
          .style("fill", "url(#grad-" + that.title + ")");

        that.animateWave();

        that.value = that.group.append('text')
          .text(data['usage'] + '%')
          .attr('fill', that.color)
          .attr('transform', 'translate(' + that.radius + ',' + that.radius * 1.2 + ')')
          .style('text-anchor', 'middle')
          .style('font-size', that.radius / 2 + 'px');

        that.used = that.pane.select('.used').text(data['used']);
        that.total = that.pane.select('.total').text(data['total']);

      },

      animateWave: function() {
        var that = this;

        that.wave.attr('transform','translate('+ that.waveAnimateScale(that.wave.attr('T')) + ',0)');

        that.wave
          .transition()
          .duration(that.animationTime * (1 - that.wave.attr('T')))
          .ease('linear')
          .attr('transform','translate('+ that.waveAnimateScale(1) +',0)')
          .attr('T', 1)
          .each('end', function(){
              that.wave.attr('T', 0);
              that.animateWave(that.animationTime);
          });

      },
      
      render: function(data) {
        var that = this;

        that.waveScaleY = d3.scale.linear().range([0, that.waveHeightScale(data['usage']) * that.innerRadius]).domain([0, 1]);

        var clipArea = d3.svg.area()
          .x(function(d){
            return that.waveScaleX(d.x);
          })
          .y0(function(d) { 
            return that.innerRadius * 2 * (1 - data['usage'] / 100) + that.waveScaleY(Math.sin(Math.PI * 2 * (1 - that.waveCount) + d.y * 2 * Math.PI));
          })
          .y1(function(d) {
            return (that.radius * 2 + that.waveHeightScale(data['usage']) * that.radius);
          });

        that.wave
          .transition()
          .duration(0)
          .transition()
          .duration(2000)
          .attr('d', clipArea)
          .attr('transform','translate(' + that.waveAnimateScale(1) + ',0)')
          .attr('T','1')
          .each("end", function(){
              if(that.animationTime){
                  that.wave.attr('transform','translate('+ that.waveAnimateScale(0) +',0)');
                  that.animateWave(that.animationTime);
              }
          });

        //数字渐变
        var textTween = function() {
          var i = d3.interpolate(parseInt(this.textContent.slice(0, this.textContent.length - 1)), data['usage']);
          return function(t) { this.textContent = parseInt(i(t)) + '%'; }
        };

        that.value
          .transition()
          .duration(2000)
          .tween("text", textTween);

        that.used
          .text(data['used']);

      }
		
	}

	window.LiquidGauge = LiquidGauge;

})();