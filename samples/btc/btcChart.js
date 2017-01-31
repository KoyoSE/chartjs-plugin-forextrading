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
  volume: {
    data: volume,
  },
  lasts: {
    data: lsb[0],
  },
  sells: {
    data: lsb[1],
  },
  buys: {
    data: lsb[2],
  },
};

var ctx = document.getElementById("canvas").getContext("2d");
var myChart = ftChart(ctx, config, btcDatasets);
