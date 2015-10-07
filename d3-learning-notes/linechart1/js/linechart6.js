﻿/**
 * @name linechart6
 * @desc 更新、过度和动画
 * @auth Jiangang Lu
 * @date 2015/09/27
 */


//(1)准备数据集
var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];
            
//(2)设置SVG的高宽
var w=600;
var h=250; 
var barPadding = 1;
//(3)定义序数比例尺
var xScale=d3.scale.ordinal()//序数比例尺
            .domain(d3.range(dataset.length))  
            .rangeRoundBands([0,w],0.05); 
var yScale=d3.scale.linear()//y仍然是线性比例尺
 .domain([0,d3.max(dataset)])
 .range([0,h]);          
 //(4)Create SVG element
 var svg = d3.select("body")//选中DOM中的目标元素
        .append("svg")//为目标元素附加上一个svg子元素
        .attr("width", w)//设置这个svg的宽
        .attr("height", h);//设置这个svg的高
 //(5)为SVG添加条形
 svg.selectAll("rect")//选中空元素，表示即将创建这样的元素
    .data(dataset)//对此后的方法都执行dataset.length遍
    .enter()//数据元素值比前面选中的DOM元素多就创建一个新的DOM元素
    .append("rect")//取得enter的占位元素，并把rect追加到对应的DOM中
    .attr("x", function(d, i) {//设置横坐标，从0开始每次右移元素宽那么长(w / dataset.length)
            //return i * (w / dataset.length);
            return xScale(i);//这里使用序数比例尺，自己去找刚才划分好的档位
    })
    .attr("y", function(d) {//设置纵坐标，纵坐标正方向是从上往下的，所以条有多长就要设置起点是相对于h再向上移动条长
            return h - yScale(d);
    })
    //.attr("width", w / dataset.length - barPadding)//设置元素宽，留出间隙宽barPadding。
    .attr("width", xScale.rangeBand())//这里xScale比例尺已经设置间距了所以直接用
    .attr("height", function(d) {
            return yScale(d);
    })
    .attr("fill", function(d) {//设置RGB颜色与数值的关系
            return "rgb(0, 0, " + (d * 10) + ")";
    });
 //(6)为条加上数值
 svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) {
        return d;
   })
   .attr("text-anchor", "middle")
   .attr("x", function(d, i) {
        return xScale(i)+xScale.rangeBand()/2;
   })
   .attr("y", function(d) {
        return h - yScale(d) + 14;
   })
   .attr("font-family", "sans-serif")
   .attr("font-size",function(d) {
         return xScale.rangeBand()/2;
   })
   .attr("fill", "white");
 //(15)删除一条
 d3.select("a")
 .on("click",function(){
 //选择所有条
 dataset.shift();
 //更新X轴比例尺
 xScale.domain(d3.range(dataset.length));

 var bars=svg.selectAll("rect")
 .data(dataset); 

 bars.exit()
 .transition()
 .duration(500)
 .attr("x", w)
 .remove();
 });
 //(14)添加一条
 d3.select("p")
 .on("click",function(){
 //数据集最后添加数值
 var maxValue=75;
 var newNumber =Math.floor(Math.random()*maxValue);//0-24的整数
    dataset.push(newNumber);
 //更新X轴比例尺
 xScale.domain(d3.range(dataset.length));
 //选择所有条
 var bars=svg.selectAll("rect")
 .data(dataset); //绑定数据到元素集，返回更新的元素集

 var texts=svg.selectAll("text")
 .data(dataset);
 //添加条形元素到最右边
 bars.enter()
 .append("rect")
 .attr("x",w);//在SVG最右边，不可见
 //
 texts.enter()
 .append("text");
      
 //更新新矩形到可见范围内
 //并在这个时候根据数据集为每个条设置对应的属性
 bars.transition()
 .duration(500)
 .attr("x", function(d, i) {
     return xScale(i) ;
  })//每个X对应到它相应的档位上
 .attr("y", function(d) {
     return h - yScale(d) ;
  })    
 .attr("width", xScale.rangeBand())//这里xScale比例尺已经设置间距了所以直接用
 .attr("height", function(d) {
            return yScale(d);
    })
 .attr("fill", function(d) {//设置RGB颜色与数值的关系
            return "rgb(0, 0, " + (d * 10) + ")";
    });
    //
 texts.transition()
 .duration(500)
 .text(function(d) {
                    return d;
               })
               .attr("text-anchor", "middle")
               .attr("x", function(d, i) {
                    return xScale(i)+xScale.rangeBand()/2;
               })
               .attr("y", function(d) {
                    return h - yScale(d) + 14;
               })
               .attr("font-family", "sans-serif")
               .attr("font-size", "12px")
               .attr("fill", "red");
 });
 //(7)更新条形数长短的代码,需要一个button标签配合
 //特别注意：这里选中的元素必须在d3选择器之前，或许要先加载完了元素才能被选中
 d3.select("button")
 .on("click",function(){
 //(12)新数据集,随机数组
 var numValues=dataset.length;
 dataset=[];
 var maxValue=75;
 var newNumber;
 for(var i=0;i<numValues;i++){
    newNumber=Math.floor(Math.random()*maxValue);//0-24的整数
    dataset.push(newNumber);
 }
 //(13)更新比例尺，免使纵坐标超出范围
 yScale.domain([0,d3.max(dataset)]);//只要更新定义域就行了，映射到的值域不变
    //更新所有的矩形
    svg.selectAll("rect")
    .data(dataset)
    .transition()//(9)加上过渡动画 
    .delay(function(d,i){
        return  i/dataset.length*1000;
    })//指定过度什么时间开始，可以用函数控制每一条的动画时间，这样就可得到钢琴版的效果
    .duration(2000)//(10)加上动画的持续时间，以毫秒计算
    .ease("linear")//(11)缓动函数：有circle（加速）elastic（伸缩），linear（匀速），bounce（弹跳）
    .attr("y",function(d){
        return h-yScale(d);
    })
    .attr("height",function(d){
        return yScale(d);
    });
    //(8)更新条上的数值
    svg.selectAll("text")
               .data(dataset)
               .text(function(d) {
                    return d;
               })
               .attr("text-anchor", "middle")
               .attr("x", function(d, i) {
                    return xScale(i)+xScale.rangeBand()/2;
               })
               .attr("y", function(d) {
                    return h - yScale(d) + 14;
               })
               .attr("font-family", "sans-serif")
               .attr("font-size", "12px")
               .attr("fill", "red");
 });    
