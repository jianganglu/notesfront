$(function(){

	var cpuLiquidGauge, memLiquidGauge, diskLiquidGauge, areaAxis, area, progress, list, status, bar, barAxis,
		windowsWidth = $(window).width(),
		toggleUrl = false,
		urls = ['../openstack_dashboard/static/dark/json/system_overview_usage0.json', '../openstack_dashboard/static/dark/json/system_overview_usage1.json'],
		responseUrls = ['../openstack_dashboard/static/dark/json/application_response_value0.json', '../openstack_dashboard/static/dark/json/application_response_value1.json'],
		reliabilityUrls = ['../openstack_dashboard/static/dark/json/application_reliability_value0.json', '../openstack_dashboard/static/dark/json/application_reliability_value1.json'],
		statusUrls = ['../openstack_dashboard/static/dark/json/infra_status.json', '../openstack_dashboard/static/dark/json/infra_status2.json'],
		departmentUrls = ['../openstack_dashboard/static/dark/json/department_usage0.json', '../openstack_dashboard/static/dark/json/department_usage1.json'];

	var configureList = $('#configure-list'),
		applicationList = $('#application-list'),
		configureCacheData,
		currentPage = 1;


	//初始化函数
	function init() {

		var gaugePaneWidth = $('#system_overview .gauge-pane').width(),
			gaugePaneHeight = $(window).height() * 0.1;


		cpuLiquidGauge = new LiquidGauge({
            animationTime: 8000,
            pane : d3.select('#cpu'),
            graph: d3.select('#cpu svg').attr('height', gaugePaneHeight),
            radius: gaugePaneHeight * 0.5,
            circleX : 0,
            circleY : 0,
            color : '#526979',
            title: 'CPU'
        });

        memLiquidGauge = new LiquidGauge({
            animationTime: 8000,
            pane : d3.select('#mem'),
            graph: d3.select('#mem svg').attr('height', gaugePaneHeight),
            radius: gaugePaneHeight * 0.5,
            circleX : 0,
            circleY : 0,
            // unit : 'MB',
            color : '#206E9E',
            title: '内存'
        });

        diskLiquidGauge = new LiquidGauge({
            animationTime: 8000,
            pane : d3.select('#disk'),
            graph: d3.select('#disk svg').attr('height', gaugePaneHeight),
            radius: gaugePaneHeight * 0.5,
            circleX : 0,
            circleY : 0,
            // unit : 'GB',
            color : '#5F519E',
            title: '磁盘'
        });

        areaAxis = new Axis({
        	svg: d3.select('#net svg.axis').attr('height', gaugePaneHeight * 3),
           	innerWidth: $('body').hasClass('mini-navbar') ? windowsWidth - 170 : windowsWidth - 316,
           	innerHeight: $('#net').height(),
           	type: 'time',
           	showYLine : true,
           	// tickSize : 16,
           	yAxisTextOffsetX: '.2em',
           	padding: {top:20, right:0, left:40, bottom:30}
        });

        areaAxis.init();

        area = new Area({
        	animationTime: 1500,
        	graph: d3.select('#net svg.area-g').attr('width', $('body').hasClass('mini-navbar') ? windowsWidth - 210 : windowsWidth - 346).attr('height', gaugePaneHeight * 3),
        	axis: areaAxis,
        	areaValue: d3.select('#net .value')
        });

        progress = new Progress({
        	animationTime: 1500,
        	container: d3.select('.speed-pane'),
        	graph:  d3.select('.speed-pane svg').attr('height', gaugePaneHeight * 2.6),
        	width: $('body').hasClass('mini-navbar') ? $('.speed-pane svg').width() + (146 / 3) : $('.speed-pane svg').width(),
        	height: $('.speed-pane svg').height(),
        	rectRate: windowsWidth > 1280 ? 0.78 : 0.75
        });

        list = new List({
        	container: d3.select('.reliability-pane').style('height', gaugePaneHeight * 2.631 + 'px'),
        	height: gaugePaneHeight * 2.631
        });

        status = new Status({
        	container: d3.select('#infra-status').style('height', gaugePaneHeight * 2.631 + 'px'),
        	height: gaugePaneHeight * 2.631
        });

        barAxis = new Axis({
        	svg: d3.select('#department-usage svg').attr('height', gaugePaneHeight * 2.6),
           	innerWidth: $('body').hasClass('mini-navbar') ? $('#department-usage svg').width() + (146 / 3) : $('#department-usage svg').width(),
           	innerHeight: $('#department-usage svg').height(),
           	yAxisTextOffsetX : '.8em',
           	rotate : -15,
           	showYLine : true,
           	yAxisTextOffsetX: '.2em',
           	xAxisTextOffsetY: '.8em',
           	padding: {top:20, right:0, left:50, bottom:40},
           	textAnchor: 'end'
        });

        barAxis.init();

        bar = new Bar({
        	axis: barAxis,
        	color: '#61A0A9',
        	animationTime: 1500
        });

        cpuLiquidGauge.init();
        memLiquidGauge.init();
        diskLiquidGauge.init();

		//初始化部门数据
		d3.json('/admin/project_usage/', function(data) {

			data.sort(function (a, b) {
				return a.usage < b.usage;
			});

			if($(window).width() <= 1280) {
          		data = data.slice(0, 5);
        	}

			barAxis.update(data.map(function (d){
				return d.name;
			}),[0, d3.max(data, function (d) {
				return d.usage;
			}) * 1.5]);

			bar.draw(data);
		});

		//初始化基础设施状态
		d3.json('/admin/cluster_num/', function(data) {
			status.draw(data);
		});

		//初始化应用系统响应速度数据
		d3.json('/admin/display_list/delay/', function(data) {
			progress.init(data);
			//应用系统响应速度推送
			var applicationSocket = new WebSocket('ws://' + monitor_ip + ':' + monitor_port + '/application');
			applicationSocket.onopen = function() {
				console.log('application socket open');
			}
			applicationSocket.onerror = function() {
				console.log('application socket error');
			}
			applicationSocket.onmessage = updateApplication;

		});

		//初始化应用系统可靠性数据
		d3.json('/admin/display_list/stability/', function(data) {
			list.init(data);
			d3.json('/admin/stability/', function (data) {
				list.draw(data);
			});
		});


		//资源数据推送

		var resourceSocket = new WebSocket('ws://' + monitor_ip + ':' + monitor_port + '/resource');
		resourceSocket.onopen = function() {
			console.log('resource socket open');
		}

		resourceSocket.onerror = function() {
			console.log('resource socket error');
		}
		resourceSocket.onmessage = updateResource;

		


		//左侧菜单栏缩放监听
		$('body').on('mini-navbar',toggleNavbar);

		$('#application-rate .header .edit').on('click', function(){
			configureEdit(progress.data, 'progress');
			$('#myModalLabel').text($('#application-rate .header h3').text());
		});
		$('#application-reliability .header .edit').on('click', function(){
			configureEdit(list.data, 'list');
			$('#myModalLabel').text($('#application-reliability .header h3').text());
		});

		$('#edit-modal .submit').on('click', submitConfigure);

		$('#edit-modal .pageNav .pre').on('click', prePage);
		$('#edit-modal .pageNav .next').on('click', nextPage);

		configureList.sortable();

	}

	function update() {

		d3.json('/admin/cluster_num/', function (data) {
			status.draw(data);
		});

		d3.json('/admin/project_usage/', function (data) {
			data.sort(function (a, b) {
				return a.usage < b.usage;
			});
			if($(window).width() <= 1280) {
          		data = data.slice(0, 5);
        	}

			barAxis.update(data.map(function (d){
				return d.name;
			}),[0, d3.max(data, function (d) {
				return d.usage;
			}) * 1.5]);

			bar.draw(data);
		});

		d3.json('/admin/stability/', function (data) {
			list.draw(data);
		});


	}
	// var count = 0;
	function updateResource(evt){
		var data = JSON.parse(evt.data);
		//console.log(data);

		if(!cpuLiquidGauge.isDraw) {
			cpuLiquidGauge.draw(data['cpu']);
		} else {
			cpuLiquidGauge.render(data['cpu']);
		}

		if(!memLiquidGauge.isDraw) {
			memLiquidGauge.draw(data['mem']);
		} else {
			memLiquidGauge.render(data['mem']);
		}

		if(!diskLiquidGauge.isDraw) {
			diskLiquidGauge.draw(data['disk']);
		} else {
			diskLiquidGauge.render(data['disk']);
		}

		//---------------------------------------
		//坐标轴更新
		// var random = Math.random();
		// if(random > 0.5 && count < 10) {
		// 	if(count < 5) {
		// 		data['net']['upload'] = 11235;
		// 		count ++;
		// 	} else if(count < 10) {
		// 		data['net']['download'] = 112351252;
		// 		count ++;
		// 	}
			
		// }
		var upload = unitTransfer(data['net']['upload']);

		area.areaValue.select('.upload-speed .num').text(parseInt(upload.value));
		area.areaValue.select('.upload-speed .unit').text(area.unit[upload.unit]);

		var download = unitTransfer(data['net']['download']);
		area.areaValue.select('.download-speed .num').text(parseInt(download.value));
		area.areaValue.select('.download-speed .unit').text(area.unit[download.unit]);


		for(var value in data['net']) {
			data['net'][value] /= Math.pow(1024, area.unitIndex);
			if(data['net'][value] > area.max) area.max = data['net'][value];
		}

		if(area.max > 1024) {
			//单位升级
			area.unitIndex ++;
			area.max /= 1024;
			data['net']['upload'] /= 1024;
			data['net']['download'] /= 1024;
			for(var i = 0;i < area.data[0].length;i ++) {
				area.data[0][i].value /= 1024;
			}
			for(var i = 0;i < area.data[1].length;i ++) {
				area.data[1][i].value /= 1024;
			}

		} else if(area.max < 1 &&area.unitIndex > 0) {
			area.unitIndex --;
			area.max *= 1024;
			data['net']['upload'] *= 1024;
			data['net']['download'] *= 1024;
			for(var i = 0;i < area.data[0].length;i ++) {
				area.data[0][i].value *= 1024;
			}
			for(var i = 0;i < area.data[1].length;i ++) {
				area.data[1][i].value *= 1024;
			}
		}
		//更新单位
		d3.select('#net .axis-unit span').text(area.unit[area.unitIndex]);
		var e = new Date(data['time']), s = new Date(Date.parse(e) - 1 * 60 * 1000);
		data['time'] = new Date(data['time']);
		areaAxis.update([s, e], [0, area.max * 1.5]);
		//-----------------------------------------
		//区域图更新
		area.draw(data);
		//-----------------------------------------

	}

	function updateApplication(evt) {
		progress.draw(JSON.parse(evt.data));
	}

	//-------------------------------------------------------------------------------------

	//侧边栏缩放调整
	function toggleNavbar() {
		if($('body').hasClass('mini-navbar')) {
			areaAxis.width = windowsWidth - 170;
			area.graph.attr('width', windowsWidth - 210);

			progress.width += (146 / 3);

			barAxis.width += (146 / 3); 
		} else {
			areaAxis.width = windowsWidth - 316;
			area.graph.attr('width', windowsWidth - 346);

			progress.width -= (146 / 3);
			barAxis.width -= (146 / 3);
		}

		
		progress.update();
		barAxis.initScale();
		barAxis.update();
		bar.update();
		areaAxis.initScale();
		areaAxis.update();
		area.update();
	}

	function unitTransfer(value) {
		var index = 0;

		while(value > 1024) {
			value /= 1024;
			index ++;
		}

		return {
			'value' : value,
			'unit' : index
		}
	}


	function configureEdit(configureData, graph) {

		currentPage = 1;
		configureCacheData = $.extend(true, [], configureData);

		// 分页按钮状态
		$('#edit-modal .pageNav .pre').addClass('disabled');

		$('#edit-modal').modal('show');
		$('#edit-modal').attr('graph', graph);


		d3.json('/admin/all_instance/1', function (data) {
			
			configureList.html('');

			generateApplicationList(data.instances);

			if(data.has_more > 0) {
				$('#edit-modal .pageNav .next').removeClass('disabled');
			}


			// 初始化右侧列表
			for(var i = 0, len = configureCacheData.length;i < len;i ++) {

				var html = '<li class="table-item row">' + 
				    			'<div class="col-md-4 col"><input disabled="disabled" model="name" value="' + configureCacheData[i].name + '"/></div>' +
				    			'<div class="col-md-4 col"><input model="displayName" class="display-name" value="' +  configureCacheData[i].display_name + '"/></div>' +
				    			'<div class="col-md-4 align-right">' +
				    				'<span class="glyphicon glyphicon-plus add" aria-hidden="true"></span>' +
				    				'<span class="glyphicon glyphicon-minus remove" aria-hidden="true"></span>' +
				    			'</div>' +
				    		'</li>';

			   	configureList.append(html);

			   	var item = configureList.find('li:last');

			   	item.data({
			   		'instancesId' : configureCacheData[i].id,
			   		'name' : configureCacheData[i].name,
			   		'displayName' : configureCacheData[i].display_name,
			   		'isSelected' : true
			   	});

			   	item.addClass('minus');

			}

			configureList.find('.add').on('click', addConfigure);
			configureList.find('.remove').on('click', removeConfigure);			
			configureList.find('input').on('input', updateConfigure);
			configureList.find('input').on('blur', submitUpdate);

		});

	}
	// 添加条目
	function addConfigure(e) {
		var item = $(this).parent().parent();

		if(item.data('isSelected') || configureList.find('.table-item').length >= 5) {
			return;
		} else {
			var itemClone = item.clone(true);
			item.find('.add').addClass('disabled');
			item.data('isSelected', true);

			itemClone.addClass('minus');
			configureList.append(itemClone);

			var data = {
		  		'id' : item.data('instancesId'),
		  		'display_name' : item.data('displayName'),
		  		'name' : item.data('name')
		  	};
		  	configureCacheData.push(data);

		}

	}
	// 删除条目
	function removeConfigure(e) {
		var item = $(this).parent().parent();
		applicationList.find('.table-item').each(function (i, element) {
			if($(element).data("instancesId") == item.data("instancesId")) {
				$(element).data('isSelected', false);
				$(element).find('.add').removeClass('disabled');
				
				return false;
			}
		});

		//更新图表数据
	 	for(var i = 0,len = configureCacheData.length;i < len;i ++) {
	 		if(configureCacheData[i].id == item.data('instancesId')) {
	 			configureCacheData.splice(i, 1);
	 			break;
	 		}
	 	}

		item.remove();
		

	}
	// 前端更新配置 
	function updateConfigure(e) {

		var item = $(this).parent().parent(), input = $(this);

		item.data(input.attr('model'), input.val());

		if(item.hasClass('minus')) {
			applicationList.find('.table-item').each(function (i, element) {
				if($(element).data("instancesId") == item.data("instancesId")) {
					$(element).find('input[model="' + input.attr('model') + '"]').val(input.val());
					$(element).data(input.attr('model'), input.val());
					return false;
				}
			});
		} else {
			configureList.find('.table-item').each(function (i, element) {
				if($(element).data("instancesId") == item.data("instancesId")) {
					$(element).find('input[model="' + input.attr('model') + '"]').val(input.val());
					$(element).data(input.attr('model'), input.val());
					return false;
				}
			});
		}


	}
	// 提交显示配置
	function submitConfigure() {

		var data = [];

		configureList.find('.table-item').each(function (i, element) {
			data.push({
				"id" : $(element).data('instancesId'),
				"name" : $(element).data('name'),
				"display_name" : $(element).data('displayName'),
			});
		});

		if($('#edit-modal').attr('graph') == 'progress') {
			$.ajax({
			  type: 'POST',
			  url: '/admin/update_display_list/delay/',
			  data: {
			  	"csrfmiddlewaretoken" : csrf_token,
			  	"uuid_list" : JSON.stringify(data.map(function (d){ return d.id;}))
			  },
			  success: function(res){
			  	$('#edit-modal').modal('hide');
			  	progress.init(data);
			  	progress.updateName();
			  	progress.render();
			  },
			  dataType: 'json'
			});
		} else if($('#edit-modal').attr('graph') == 'list') {
			$.ajax({
			  type: 'POST',
			  url: '/admin/update_display_list/stability/',
			  data: {
			  	"csrfmiddlewaretoken" : csrf_token,
			  	"uuid_list" : JSON.stringify(data.map(function (d){ return d.id;}))
			  },
			  success: function(res){
			  	$('#edit-modal').modal('hide');
			  	list.init(data);
			  	list.updateName();
			  	d3.json('/admin/stability/', function (data) {
					list.draw(data);
				});
			  },
			  dataType: 'json'
			});
		}
	}

	function generateApplicationList(applicationListData) {
		applicationList.html('');
		//初始化左侧列表
		for(var i = 0,len = applicationListData.length;i < len;i ++) {
			var html = '<li class="table-item row">' + 
			    			'<div class="col-md-4 col"><input disabled="disabled" model="name" value="' + applicationListData[i].name + '"/></div>' +
			    			'<div class="col-md-4 col"><input model="displayName" class="display-name" value="' +  applicationListData[i].display_name + '"/></div>' +
			    			'<div class="col-md-4 align-right">' +
			    				'<span class="glyphicon glyphicon-plus add" aria-hidden="true"></span>' +
			    				'<span class="glyphicon glyphicon-minus remove" aria-hidden="true"></span>' +
			    			'</div>' +
			    		'</li>';

		   	applicationList.append(html);

		   	var item = applicationList.find('li:last');

		   	item.data({
			   	'instancesId' : applicationListData[i].id,
			   	'name' : applicationListData[i].name,
			   	'displayName' : applicationListData[i].display_name,
			   	'isSelected' : false
			});

			var isConfigure = configureCacheData.some(function (d){
					if(d.id == applicationListData[i].id) {
						return true;
					}
				});			

			if(isConfigure) {
				item.find('.add').addClass('disabled');
				item.data('isSelected', true);
			}

		}
		
		applicationList.find('.add').on('click', addConfigure);
		applicationList.find('.remove').on('click', removeConfigure);			
		applicationList.find('input').on('input', updateConfigure);
		applicationList.find('input').on('change', submitUpdate);
	}

	// 修改配置信息提交到后台
	function submitUpdate(e) {
		var that = this;
		var item = $(that).parent().parent();

		$.ajax({
		  type: 'POST',
		  url: '/admin/update_name/',
		  data: {
		  	"csrfmiddlewaretoken" : csrf_token,
		  	"uuid" : item.data('instancesId'),
		  	"display_name": $(that).val()
		  },
		  complete: function(res){
		  	var arr;

		  	for(var i = 0,len = progress.data.length;i < len;i ++) {
		  		if(progress.data[i].id == item.data('instancesId')) {
		  			progress.data[i].display_name = $(that).val();
		  			break;
		  		}
		  	}
		  	for(var i = 0,len = list.data.length;i < len;i ++) {
		  		if(list.data[i].id == item.data('instancesId')) {
		  			list.data[i].display_name = $(that).val();
		  			break;
		  		}
		  	}
		  	progress.updateName(item.data('instancesId'), $(that).val());
			list.updateName(item.data('instancesId'), $(that).val());
		  },
		  dataType: 'json'
		});

	}

	function prePage() {
		if($(this).hasClass('disabled')) {
			return;
		}
		currentPage --;
		if($('#edit-modal .pageNav .next').hasClass('disabled')) {
			$('#edit-modal .pageNav .next').removeClass('disabled');
		}

		d3.json('/admin/all_instance/' + currentPage, updatePage);
	}

	function nextPage() {
		if($(this).hasClass('disabled')) {
			return;
		}
		currentPage ++;
		if($('#edit-modal .pageNav .pre').hasClass('disabled')) {
			$('#edit-modal .pageNav .pre').removeClass('disabled');
		}

		d3.json('/admin/all_instance/' + currentPage,updatePage);
	}

	function updatePage(data) {

		applicationListData = data.instances;
		applicationList.html('');

		//初始化左侧列表
		for(var i = 0,len = applicationListData.length;i < len;i ++) {
			var html = '<li class="table-item row">' + 
			    			'<div class="col-md-4 col"><input disabled="disabled" model="name" value="' + applicationListData[i].name + '"/></div>' +
			    			'<div class="col-md-4 col"><input model="displayName" class="display-name" value="' +  applicationListData[i].display_name + '"/></div>' +
			    			'<div class="col-md-4 align-right">' +
			    				'<span class="glyphicon glyphicon-plus add" aria-hidden="true"></span>' +
			    				'<span class="glyphicon glyphicon-minus remove" aria-hidden="true"></span>' +
			    			'</div>' +
			    		'</li>';
		   	applicationList.append(html);
		   	var item = applicationList.find('li:last');
		   	item.data({
		   		'instancesId' : applicationListData[i].id,
		   		'name' : applicationListData[i].name,
		   		'displayName' : applicationListData[i].display_name,
		   		'isSelected' : false
		   	});

			var isConfigure = configureCacheData.some(function (d){
				if(d.id == applicationListData[i].id) {
					return true;
				}
			});			
			if(isConfigure) {
				item.find('.add').addClass('disabled');
				item.data('isSelected', true);
			}
		}

		applicationList.find('.add').on('click', addConfigure);
		applicationList.find('.remove').on('click', removeConfigure);			
		applicationList.find('input').on('input', updateConfigure);
		applicationList.find('input').on('change', submitUpdate);

		if(!data.has_more) {
			$('#edit-modal .pageNav .next').addClass('disabled');
		}

		if(currentPage == 1) {
			$('#edit-modal .pageNav .pre').addClass('disabled');
		}
	}


	init();

	setInterval(function() {
		update();
	}, 60000);

});