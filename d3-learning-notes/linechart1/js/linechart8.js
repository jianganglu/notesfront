/**
 * @name linechart8
 * @desc linechart8
 * @auth Jiangang Lu
 * @date 2015/10/06
 */

;(function() {
  var Data;

  var table = d3.select('body')
    .append('table')
    .attr('class', 'table');
  var thead = table.append('thead'),
      tbody = table.append('tbody');

  var reload = function() {
    d3.csv('../data/villains.csv', function(data) {
      Data = data;
      Data = Data.filter(function(d) { return d['Doctor actor'] == 'Matt Smith'; });
      redraw();
    });
  };
  reload();

  var redraw = function() {
    var tr = tbody.selectAll('tr').data(Data)
    tr.enter().append('tr');
    tr.exit().remove();

    tr.selectAll('td')
      .data(function(d) { return d3.values(d); }) // d3.values(d)可以把对象转成数据
      .enter()
      .append('td')
      .text(function(d) { return d; });

    tbody.selectAll('tr')
      .sort(function(a, b) { return d3.ascending(a['Year first'], b['Year first']); }); // d3.ascending(a['Year first'], b['Year first']); 升序
    tbody.selectAll('tr').sort(function (a, b) {
      return d3.descending(Number(a['Doc. no.']), Number(b['Doc. no.']));
    });
    tbody.selectAll('tr')
      .filter(function(d) { return d['Doctor actor'] != 'Matt Smith'; })
      .remove();
  }
})();
