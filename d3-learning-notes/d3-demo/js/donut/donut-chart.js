;(function() {
  'use strict';

  var Donut = function(element, options) {
    this.element = element;
    this.options = this.extend({}, Donut.DEFAULTS, options);
    this.init();
  }

  Donut.VERSION = '1.0.0';

  Donut.DEFAULTS = {
    width: 960,
    height: 450,
    colors: ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']
  };

  Donut.prototype.init = function() {
    var self = this;
    self.svg = d3.select(self.element)
      .append('svg')
      .append('g')

    var svg = self.svg;

    svg.append('g')
      .attr('class', 'slices');
    svg.append('g')
      .attr('class', 'labels');
    svg.append('g')
      .attr('class', 'lines');
    svg.append('g')
      .attr('class', 'circles');

    var width = self.options.width,
        height = self.options.height;
    self.radius = Math.min(width, height) / 2;

    self.pie = d3.pie()
      .sort(null)
      .value(function(d) {
        return d.value;
      });

    self.arc = d3.arc()
      .outerRadius(self.radius * 0.8)
      .innerRadius(self.radius * 0.4);

    self.outerArc = d3.arc()
      .innerRadius(self.radius * 0.9)
      .outerRadius(self.radius * 0.9);

    // self.arc = d3.arc()
    //   .outerRadius(self.radius * 0.6)
    //   .innerRadius(self.radius * 0.35);

    // self.outerArc = d3.arc()
    //   .innerRadius(self.radius * 0.9)
    //   .outerRadius(self.radius * 0.9);

    svg.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    self.key = function(d){ return d.data.label; };

    self.color = d3.scaleOrdinal()
      .domain(self.fmtLabels(self.options.data))
      .range(self.options.colors);

    self.render(self.options.data);
  };

  Donut.prototype.bind = function() {

  };

  Donut.prototype.enter = function() {

  };

  Donut.prototype.randomData = function(data) {
    var self = this;

    var labels = self.color.domain();
    return labels.map(function(label, i){
      if(data[i].value) {
        return { label: label, value: data[i].value }
      }
    });
  }

  Donut.prototype.render = function(data) {
    var self = this;

    var data = self.randomData(data);

    /* ------- PIE SLICES ------- */
    var slice = self.svg.select('.slices').selectAll('path.slice')
      .data(self.pie(data), self.key);

    slice = slice.enter()
      .insert('path')
      .style('fill', function(d) { return self.color(d.data.label); })
      .attr('class', 'slice')
      .merge(slice);

    slice   
      .transition().duration(1000)
      .attrTween('d', function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          return self.arc(interpolate(t));
        };
      })

    slice.exit()
      .remove();

    /* ------- TEXT LABELS ------- */
    var text = self.svg.select('.labels').selectAll('text')
      .data(self.pie(data), self.key);

    text = text.enter()
      .append('text')
      .attr('dy', '.35em')
      .text(function(d) {
        return d.data.label;
      })
      .merge(text);
    
    function midAngle(d){
      return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text.transition().duration(1000)
      .attrTween('transform', function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = self.outerArc.centroid(d2);
          pos[0] = self.radius * (midAngle(d2) < Math.PI ? 1 : -1);
          return 'translate('+ pos +')';
        };
      })
      .styleTween('text-anchor', function(d){
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? 'start': 'end';
        };
      });

    text.exit()
      .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/
    var polyline = self.svg.select('.lines').selectAll('polyline')
      .data(self.pie(data), self.key);

    polyline = polyline.enter()
      .append('polyline')
      .merge(polyline);

    polyline.transition().duration(1000)
      .attrTween('points', function(d){
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = self.outerArc.centroid(d2);
          pos[0] = self.radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [self.arc.centroid(d2), self.outerArc.centroid(d2), pos];
        };      
      });
    
    polyline.exit()
      .remove();

    /* ------- SLICE TO CIRCLE POLYLINES -------*/
    var circle = self.svg.select('.circles').selectAll('circle')
      .data(self.pie(data), self.key);

    circle = circle.enter()
      .append('circle')
      .attr('r', 3)
      .attr('fill', '#FFF')
      .merge(circle);

    circle.transition().duration(1000)
      .attrTween('transform', function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = self.outerArc.centroid(d2);
          pos[0] = self.radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return 'translate('+ pos +')';
        };
      });

    circle.exit()
      .remove();
  };

  Donut.prototype.exit = function() {

  };

  Donut.prototype.fmtLabels = function(data) {
    var labels = [],
        len = data.length;

    for(var i = 0; i < len; i++) {
      labels.push(data[i].label);
    }

    return labels;
  };

  // 为与源码的下标对应上，我们把第一个参数称为`第0个参数`，依次类推
  Donut.prototype.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {}, // 默认第0个参数为目标参数
    i = 1, // i表示从第几个参数凯斯想目标参数进行合并，默认从第1个参数开始向第0个参数进行合并
    length = arguments.length,
    deep = false; // 默认为浅度拷贝
   
    // 判断第0个参数的类型，若第0个参数是boolean类型，则获取其为true还是false
    // 同时将第1个参数作为目标参数，i从当前目标参数的下一个
    // Handle a deep copy situation
    if ( typeof target === 'boolean' ) {
      deep = target;
   
      // Skip the boolean and the target
      target = arguments[ i ] || {};
      i++;
    }
   
    // 判断目标参数的类型，若目标参数既不是object类型，也不是function类型，则为目标参数重新赋值 
    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== 'object' ) {
      target = {};
    }
   
    // 若目标参数后面没有参数了，如$.extend({_name:'wenzi'}), $.extend(true, {_name:'wenzi'})
    // 则目标参数即为jQuery本身，而target表示的参数不再为目标参数
    // Extend jQuery itself if only one argument is passed
    if ( i === length ) {
      target = this;
      i--;
    }
   
    // 从第i个参数开始
    for ( ; i < length; i++ ) {
      // 获取第i个参数，且该参数不为null和undefind，在js中null和undefined，如果不区分类型，是相等的，null==undefined为true，
      // 因此可以用null来同时过滤掉null和undefind
      // 比如$.extend(target, {}, null);中的第2个参数null是不参与合并的
      // Only deal with non-null/undefined values
      if ( (options = arguments[ i ]) != null ) {
    
        // 使用for~in获取该参数中所有的字段
        // Extend the base object
        for ( name in options ) {
          src = target[ name ]; // 目标参数中name字段的值
          copy = options[ name ]; // 当前参数中name字段的值
     
          // 若参数中字段的值就是目标参数，停止赋值，进行下一个字段的赋值
          // 这是为了防止无限的循环嵌套，我们把这个称为，在下面进行比较详细的讲解
          // Prevent never-ending loop
          if ( target === copy ) {
            continue;
          }
     
          if ( copy !== undefined ) {
            // 若原对象存在name属性，则直接覆盖掉；若不存在，则创建新的属性
            target[ name ] = copy;
          }
        }
      }
    }
   
    // 返回修改后的目标参数
    // Return the modified object
    return target;
  };

  var data = [
    {
      label: 'Lorem ipsum',
      value: 0.11229466890476991
    },
    {
      label: 'dolor sit',
      value: 0.4480343798220039
    },
    {
      label: 'amet',
      value: 0.9812390051146385
    },
    {
      label: 'Lorem ipsum',
      value: 0.11229466890476991
    },
    {
      label: 'consectetur',
      value: 0.2913881855823728
    },
    {
      label: 'adipisicing',
      value: 0.3494127206406714
    },
    {
      label: 'elit',
      value: 0.45654629393570634
    },
    {
      label: 'sed',
      value: 0.4708486326324246
    },
    {
      label: 'do',
      value: 0.9538782744404648
    },
    {
      label: 'eiusmod',
      value: 0.3731182951542875
    },
    {
      label: 'tempor',
      value: 0.9356808023246699
    },
    {
      label: 'incididunt',
      value: 0.745405339810473
    }
  ];

  var data1 = [
    {
      label: 'Lorem ipsum',
      value: 0.4480343798220039
    },
    {
      label: 'dolor sit',
      value: 0.9812390051146385
    },
    {
      label: 'amet',
      value: 0.2913881855823728
    },
    {
      label: 'Lorem ipsum',
      value: 0.11229466890476991
    },
    {
      label: 'consectetur',
      value: 0.4708486326324246
    },
    {
      label: 'adipisicing',
      value: 0.11229466890476991
    },
    {
      label: 'elit',
      value: 0.3494127206406714
    },
    {
      label: 'sed',
      value: 0.45654629393570634
    },
    {
      label: 'do',
      value: 0.3731182951542875
    },
    {
      label: 'eiusmod',
      value: 0.4480343798220039
    },
    {
      label: 'tempor',
      value: 0.9538782744404648
    },
    {
      label: 'incididunt',
      value: 0.9356808023246699
    }
  ];

  var donut = new Donut('body', {
    width: 325,
    height: 285,
    data: data,
    colors: ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']
  });

  d3.select('.randomize')
    .on('click', function(){
      donut.render(data1);
    });
})();