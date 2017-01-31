//------
var config = {
  options: {
    title: {
      text: "USD/mBTC Chart",
      display: true,
    },
    scales: {
      xAxes: [{
        time: {
          displayFormats: {
            minute: 'D H:mm',
          },
          // round:'mm',
          unit: 'minute',
          minUnit: 'minute',
          unitStepSize: 30,

          min:'1/31/2017 4:00' ,
        }
      }],
    },
    // https://github.com/chartjs/chartjs-plugin-zoom
    // Container for pan options
    pan: {
      // Boolean to enable panning
      enabled: true,

      // Panning directions. Remove the appropriate direction to disable 
      // Eg. 'y' would only allow panning in the y direction
      mode: 'xy'
    },

    // Container for zoom options
    zoom: {
      // Boolean to enable zooming
      enabled: true,

      // Zooming directions. Remove the appropriate direction to disable 
      // Eg. 'y' would only allow zooming in the y direction
      mode: 'xy',
    }
  }
};

var btcDatasets = {
  // format:true,
  volume: {
    data: volume,
    // color: 'rgb(50,50,80)',
    // fill: 0.5,
    // colorYaxis: 'rgb(150,150,180)',
  },
  lasts: {
    data: lsb[0],
    // color: 'rgb(255, 205, 86)',
    // colorYaxis: 'rgb(255,205,86)',
  },
  sells: {
    data: lsb[1],
    // color: 'rgb(255,90,90)',
    // fill: 0.3,
  },
  buys: {
    data: lsb[2],
    // color: 'rgb(90,255,90)',
    // fill: 0.3,
  },
};

var ctx = document.getElementById("canvas").getContext("2d");
var myChart = ftChart(ctx, config, btcDatasets);
