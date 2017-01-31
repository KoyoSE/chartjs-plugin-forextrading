//------
// chartjs-plugin-forextrading.js
// copyright KoyoSE
//------

var helpers = Chart.helpers;
var color = Chart.helpers.color;

// formatter
var timeFormat = 'MM/DD/YYYY HH:mm';
var dataFormat = function (dt) {
	var ret = [];
	for (var i = 0; i < dt.length; i++) {
		var val = { x: 0, y: 0 };
		val.x = moment(dt[i][0]).format(timeFormat);
		val.y = dt[i][1];
		ret.push(val);
	}
	return ret;
}
var separater = function (dt) {
	var ret = { labels: [], data: [] };
	for (var i = 0; i < dt.length; i++) {
		ret.labels.push(dt[i].x);
		ret.data.push(dt[i].y);
	}
	return ret;
};

var defaultDatasets = {
	format: true,
	volume: {
		// data: volume,
		color: 'rgb(50,50,80)',
		fill: 0.5,
		colorYaxis: 'rgb(150,150,180)',
	},
	lasts: {
		// data: lsb[0],
		color: 'rgb(255, 205, 86)',
		colorYaxis: 'rgb(255,205,86)',
	},
	sells: {
		// data: lsb[1],
		color: 'rgb(255,90,90)',
		fill: 0.3,
	},
	buys: {
		// data: lsb[2],
		color: 'rgb(90,255,90)',
		fill: 0.3,
	},
	gridLines: {
		color :"rgba(44,44,44,0.7)",
	}
};

//------------
// ftChart
//------------
var ftChart = function (ctx, config, datasets) {

	datasets = helpers.configMerge(
		defaultDatasets,
		datasets
	)

	//format
	if (datasets.format) {

		datasets.volume.data = dataFormat(datasets.volume.data);
		datasets.volume.data = separater(datasets.volume.data);

		datasets.lasts.data = dataFormat(datasets.lasts.data);
		datasets.sells.data = dataFormat(datasets.sells.data);
		datasets.buys.data = dataFormat(datasets.buys.data);
	}

	//create config
	var configDataset = {
		type: 'bar',
		data: {
			labels: datasets.volume.data.labels,
			datasets: [
			 {
				type: 'line',
				label: 'Lasts',
				yAxisID: "y-axis-2",
				lineTension: 0,
				pointRadius: 0,
				borderWidth: 2,
				borderColor: datasets.lasts.color,
				fill: false,
				data: datasets.lasts.data,
			}, {
				type: 'line',
				label: 'Sell',
				yAxisID: "y-axis-2",
				lineTension: 0,
				pointRadius: 0,
				borderWidth: 1,
				backgroundColor: color(datasets.sells.color).alpha(datasets.sells.fill).rgbString(),
				borderColor: color(datasets.sells.color).alpha(0).rgbString(),
				fill: false,
				data: datasets.sells.data,
			}, {
				type: 'line',
				label: 'Buy',
				yAxisID: "y-axis-2",
				lineTension: 0,
				pointRadius: 0,
				borderWidth: 1,
				backgroundColor: color(datasets.buys.color).alpha(datasets.buys.fill).rgbString(),
				borderColor: color(datasets.buys.color).alpha(0).rgbString(),
				fill: false,
				data: datasets.buys.data,
			},{
				type: 'bar',
				label: 'Volume',
				yAxisID: "y-axis-1",
				backgroundColor: color(datasets.volume.color).alpha(datasets.volume.fill).rgbString(),
				borderColor: color(datasets.volume.color).alpha(datasets.volume.fill).rgbString(),
				borderWidth: 3,
				data: datasets.volume.data.data,
			}
			]
		},
		options: {
			scales: {
				xAxes: [{
					type: "time",
					display: true,
					time: {
						displayFormats: {
							minute: 'D H:mm',
						},
						// round:'mm',
						unit: 'minute',
						minUnit: 'minute',
						unitStepSize: 60,
					},
					gridLines: {
				        color: datasets.gridLines.color,
						display: true,
					}
				}],
				yAxes: [{
					type: "linear",
					display: true,
					id: "y-axis-1",
					position: "left",
					ticks: {
						beginAtZero: true,
						fontColor: datasets.volume.colorYaxis,
						callback: function (value) {
							return value + "k";
						}
					},
					gridLines: {
				        color: datasets.gridLines.color,
						display: true,
					}
				}, {
					type: "linear",
					display: true,
					id: "y-axis-2",
					position: "right",
					ticks: {
						fontColor: datasets.lasts.colorYaxis,
						callback: function (value) {
							return value/1000 + "%";
						}
					},
					gridLines: {
				        color: datasets.gridLines.color,
						display: false,
					}
				}
				]
			},
		}
	}

	var configMerged = helpers.configMerge(
		configDataset,
		config || {});

	return new Chart(ctx, configMerged);
}

//--------------
// Fill plug in 
//--------------
Chart.plugins.register({

	beforeDatasetsDraw: function (chartInstance, easing) {

		var me = chartInstance;
		var helpers = Chart.helpers;
		var ctx = me.chart.ctx;

		//--- TODO:for below chart.js v2.4.x ---
		var clipArea = function (ctx, clipArea) {
			ctx.save();
			ctx.beginPath();
			ctx.rect(clipArea.left, clipArea.top, clipArea.right - clipArea.left, clipArea.bottom - clipArea.top);
			ctx.clip();
		};
		clipArea(ctx, me.chartArea);
		//------

	},

	afterDatasetsDraw: function (chartInstance, easing) {

		var me = chartInstance;
		var helpers = Chart.helpers;
		var ctx = me.chart.ctx;

		var drawFill = function (instance, baseInstance) {

			var ctx = instance._chart.ctx;
			var vm = instance._view;

			var points = instance._children.slice(); // clone array
			var basePoints = baseInstance._children.slice(); // clone array
			var index, current, currentVM;

			// Fill
			if (points.length) {
				ctx.save();
				// Chart.canvasHelpers.clipArea(ctx, me.chartArea);  //TODO : for chart.js upper v2.5.0.
				ctx.beginPath();
		
				ctx.fillStyle = vm.backgroundColor;
				ctx.strokeStyle = vm.borderColor;
				ctx.lineWidth = vm.borderWidth;

				ctx.moveTo(basePoints[0]._view.x, basePoints[0]._view.y);
				for (index = 0; index < points.length; ++index) {
					current = points[index];
					currentVM = current._view;
					ctx.lineTo(currentVM.x, currentVM.y);
				}
				for (index = basePoints.length - 1; index >= 0; --index) {
					current = basePoints[index];
					currentVM = current._view;
					ctx.lineTo(currentVM.x, currentVM.y);
				}
				ctx.fillStyle = vm.backgroundColor || globalDefaults.defaultColor;
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
				// Chart.canvasHelpers.unclipArea(ctx); //TODO : for chart.js upper v2.5.0.
				ctx.restore();
			}
		}

		var lineDataset = [];
		var count = 0;
		helpers.each(me.data.datasets, function (dataset, datasetIndex) {
			if (me.isDatasetVisible(datasetIndex)) {
				var meta = me.getDatasetMeta(datasetIndex);
				if (meta.type === "line") {
					lineDataset[count] = meta.dataset;
					count++;
				}
			}
		}, me, true);

		var instance = [];
		instance[0] = lineDataset[0].transition(easing); // buys
		instance[1] = lineDataset[1].transition(easing); // sells
		instance[2] = lineDataset[2].transition(easing); // lasts (for base line)
		drawFill(instance[1], instance[2]); // sells fill
		drawFill(instance[0], instance[2]); // buys fill

		//--- TODO:for below chart.js v2.4.x ---
		// var me = chartInstance;
		// var ctx = me.chart.ctx;
		var unclipArea = function (ctx) {
			ctx.restore();
		};
		unclipArea(ctx);
		// -----
	},
});