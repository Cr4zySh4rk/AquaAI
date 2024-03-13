<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="all.css">
    <link rel="stylesheet" href="dash.css" />
    <script src="chartmin/chart.min.js"></script>
    <script type="text/javascript" src="jscript/graph.js"></script>
    <script src="./node_modules/d3/dist/d3.js"></script>
    <title>Aqua-AI</title>

  </head>
  <body>
    <script>
      let soilFilename = '/Users/adithya/Downloads/data.csv';
      function updateSoilChart(loadedData) {
          let data = [];
          let labels = [];
          let startIndex = Math.max(0, loadedData.length - 15);
          for (let i = startIndex; i < loadedData.length; i++) {
              let soil = parseFloat(loadedData[i].Soil_Moisture);
              data.push(soil);
              labels.push(i + 1);
          }

          let soilChart = new Chart('soil', {
              type: 'line',
              data: {
                  labels: labels,
                  datasets: [{
                      data: data,
                      fill: false,
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 2,
                      pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                      pointRadius: 4,
                      pointHoverRadius: 5,
                      label: 'Soil Moisture'
                  }]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                      x: {
                          type: 'linear',
                          position: 'bottom',
                          grid: {
                              display: false
                          }
                      },
                      y: {
                          title: {
                              display: true,
                              text: 'Soil Moisture',
                              font: {
                                size: 30
                              }
                          },
                          ticks: {
                              stepSize: 20,
                              min: 0,
                              max: 100
                          }
                      }
                  },
                  elements: {
                      line: {
                          tension: 0.4
                      }
                  },
                  plugins: {
                      legend: {
                          display: true,
                          position: 'top',
                          labels: {
                              font: {
                                  size: 14
                              }
                          }
                      }
                  }
              }
          });
      }

      function updateTemperatureChart(loadedData) {
          let data = [];
          let labels = [];
          let startIndex = Math.max(0, loadedData.length - 15);
          for (let i = startIndex; i < loadedData.length; i++) {
              let temperature = parseFloat(loadedData[i].Temperature);
              data.push(temperature);
              labels.push(i + 1);
          }

          let temperatureChart = new Chart('temperature', {
              type: 'line',
              data: {
                  labels: labels,
                  datasets: [{
                      data: data,
                      fill: false,
                      borderColor: 'rgba(255, 99, 132, 1)',
                      borderWidth: 2,
                      pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                      pointRadius: 4,
                      pointHoverRadius: 5,
                      label: 'Temperature'
                  }]
              },
              options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                      x: {
                          type: 'linear',
                          position: 'bottom',
                          grid: {
                              display: false
                          }
                      },
                      y: {
                          title: {
                              display: true,
                              text: 'Temperature',
                              font: {
                                size: 30
                              }
                          },
                          ticks: {
                              stepSize: 10,
                              min: 0,
                              max: 50
                          }
                      }
                  },
                  elements: {
                      line: {
                          tension: 0.4
                      }
                  },
                  plugins: {
                      legend: {
                          display: true,
                          position: 'top',
                          labels: {
                              font: {
                                  size: 14
                              }
                          }
                      }
                  }
              }
          });
      }
      function updateHumidityChart(loadedData) {
        let data = [];
        let labels = [];
        let startIndex = Math.max(0, loadedData.length - 15);

        for (let i = startIndex; i < loadedData.length; i++) {
            let humidity = parseFloat(loadedData[i].Humidity);
            data.push(humidity);
            labels.push(i + 1);
        }

        let humidityChart = new Chart('humidity', {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    fill: false,
                    borderColor: 'rgba(255, 99, 71, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(255, 99, 71, 1)',
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    label: 'Humidity'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Humidity',
                            font: {
                                size: 30
                            }
                        },
                        ticks: {
                            stepSize: 10,
                            min: 0,
                            max: 100
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.4
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
    }
    function updateNitrogenChart(loadedData) {
      let data = [];
      let labels = [];
      let startIndex = Math.max(0, loadedData.length - 15);

      for (let i = startIndex; i < loadedData.length; i++) {
          let nitrogen = parseFloat(loadedData[i].Nitrogen);
          data.push(nitrogen);
          labels.push(i + 1);
      }

      let nitrogenChart = new Chart('nitrogen', {
          type: 'line',
          data: {
              labels: labels,
              datasets: [{
                  data: data,
                  fill: false,
                  borderColor: 'rgba(30, 144, 255, 1)',
                  borderWidth: 2,
                  pointBackgroundColor: 'rgba(30, 144, 255, 1)',
                  pointRadius: 4,
                  pointHoverRadius: 5,
                  label: 'Nitrogen'
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                  x: {
                      type: 'linear',
                      position: 'bottom',
                      grid: {
                          display: false
                      }
                  },
                  y: {
                      title: {
                          display: true,
                          text: 'Nitrogen',
                          font: {
                              size: 30
                          }
                      },
                      ticks: {
                          stepSize: 10,
                          min: 0,
                          max: 100
                      }
                  }
              },
              elements: {
                  line: {
                      tension: 0.4
                  }
              },
              plugins: {
                  legend: {
                      display: true,
                      position: 'top',
                      labels: {
                          font: {
                              size: 14
                          }
                      }
                  }
              }
          }
      });
    }
    function updatePhosphorousChart(loadedData) {
    let data = [];
    let labels = [];
    let startIndex = Math.max(0, loadedData.length - 15);

    for (let i = startIndex; i < loadedData.length; i++) {
        let phosphorous = parseFloat(loadedData[i].Phosphorous);
        data.push(phosphorous);
        labels.push(i + 1);
    }

    let phosphorousChart = new Chart('phosphorous', {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                fill: false,
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 215, 0, 1)',
                pointRadius: 4,
                pointHoverRadius: 5,
                label: 'Phosphorous'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Phosphorous',
                        font: {
                            size: 30
                        }
                    },
                    ticks: {
                        stepSize: 10, 
                        min: 0,
                        max: 100
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.4
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}
function updatePhosphorousChart(loadedData) {
    let data = [];
    let labels = [];
    let startIndex = Math.max(0, loadedData.length - 15);

    for (let i = startIndex; i < loadedData.length; i++) {
        let phosphorous = parseFloat(loadedData[i].Phosphorous);
        data.push(phosphorous);
        labels.push(i + 1);
    }

    let phosphorousChart = new Chart('phosphorous', {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                fill: false,
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 215, 0, 1)',
                pointRadius: 4,
                pointHoverRadius: 5,
                label: 'Phosphorous'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Phosphorous',
                        font: {
                            size: 30
                        }
                    },
                    ticks: {
                        stepSize: 10,
                        min: 0,
                        max: 100
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.4
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}
function updatePhosphorusChart(loadedData) {
    let data = [];
    let labels = [];
    let startIndex = Math.max(0, loadedData.length - 15);

    for (let i = startIndex; i < loadedData.length; i++) {
        let phosphorous = parseFloat(loadedData[i].Phosphorus);
        data.push(phosphorous);
        labels.push(i + 1);
    }

    let phosphorousChart = new Chart('phosphorus', {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                fill: false,
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 215, 0, 1)',
                pointRadius: 4,
                pointHoverRadius: 5,
                label: 'Phosphorus'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    grid: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Phosphorus',
                        font: {
                            size: 30
                        }
                    },
                    ticks: {
                        stepSize: 10,
                        min: 0,
                        max: 100
                    }
                }
            },
            elements: {
                line: {
                    tension: 0.4
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                }
            }
        }
    });
}

    function updatePotassiumChart(loadedData) {
        let data = [];
        let labels = [];
        let startIndex = Math.max(0, loadedData.length - 15);

        for (let i = startIndex; i < loadedData.length; i++) {
            let potassium = parseFloat(loadedData[i].Potassium);
            data.push(potassium);
            labels.push(i + 1);
        }

        let potassiumChart = new Chart('potassium', {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    fill: false,
                    borderColor: 'rgba(128, 0, 128, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(128, 0, 128, 1)',
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    label: 'Potassium'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Potassium',
                            font: {
                                size: 30
                            }
                        },
                        ticks: {
                            stepSize: 10,
                            min: 0,
                            max: 100
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.4
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        });
    }

    function updateWaterDispensedChart(loadedData) {
        let data = [];
        let labels = [];
        let startIndex = Math.max(0, loadedData.length - 15);

        for (let i = startIndex; i < loadedData.length; i++) {
            let waterDispensed = parseFloat(loadedData[i].Water_Dispensed);
            data.push(waterDispensed);
            labels.push(i + 1);
        }

        let waterDispensedChart = new Chart('waterDispensed', {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    fill: false,
                    borderColor: 'rgba(0, 128, 0, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(0, 128, 0, 1)',
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    label: 'Water Dispensed'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Water Dispensed',
                            font: {
                                size: 30,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            stepSize: 1000,
                            min: 0,
                            max: 50000
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.4
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    }

      function loadDataAndUpdateCharts(filename, updateFunction) {
          d3.csv(filename).then(function (loadedData) {
              if (!loadedData || loadedData.length === 0) {
                  console.error(`Error: No data loaded from CSV file ${filename}`);
                  return;
              }

              updateFunction(loadedData);

              setInterval(function () {
                  d3.csv(filename).then(function (updatedData) {
                      if (updatedData && updatedData.length > 0) {
                          updateFunction(updatedData);
                      }
                  });
              }, 5000);
          });
      }
      loadDataAndUpdateCharts('/Users/adithya/Downloads/data.csv', updateSoilChart);
      loadDataAndUpdateCharts('/Users/adithya/Downloads/data.csv', updateTemperatureChart);
      loadDataAndUpdateCharts('/Users/adithya/Downloads/data.csv', updateHumidityChart);
      loadDataAndUpdateCharts('/Users/adithya/Downloads/data.csv', updateNitrogenChart);
      loadDataAndUpdateCharts('/Users/adithya/Downloads/data.csv', updatePhosphorusChart);
      loadDataAndUpdateCharts('/Users/adithya/Downloads/data.csv', updatePotassiumChart);
      loadDataAndUpdateCharts('/Users/adithya/Downloads/data.csv', updateWaterDispensedChart);
  </script>
    <input type="checkbox" id="nav-toggle">
    <nav class="nav">
      <div class="sidebar-brand">
      <h1>
          <span
            ><img src="res/logo.png" width="70px" height="70px" alt="" /></span
          ><span>Aqua-AI</span>
        </h1>
      </div>
      <div class="sidebar-menu">
        <ul>
            <li>
                <a href="index.php" class="active"><span class="fa-solid fa-house"></span>
                    <span>Dashboard</span></a>
            </li>
            <li>
                <a href="settings.php"><span class="fa-solid fa-gear"></span>
                    <span>Settings</span></a>
            </li>
            <li>
                <a href="wifi.php"><span class="fa-solid fa-wifi"></span>
                    <span>WiFi Settings</span></a>
            </li>
        </ul>
    </nav>
    <div class="hidnav">
      <ul>
        <li>
            <a href="index.php"><span class="fa-solid fa-house"></span>
                <span>Dashboard</span></a>
        </li>
        <li>
            <a href="settings.php"><span class="fa-solid fa-gear"></span>
                <span>Settings</span></a>
        </li>
        <li>
            <a href="wifi.php"><span class="fa-solid fa-wifi"></span>
                <span>WiFi Settings</span></a>
        </li>
        <li>
          <a href="index.php"><span class="fa-solid fa-close"></span>
              <span>Close</span></a>
        </li>
        

    </ul>
    </div>
    <div class="mainwrap">
      <header>
        <h2>
            <label for="nav-toggle">
            <span class="fa-solid fa-bars"></span>
            </label>
            Dashboard
        </h2>
      </header>
      
      <div class="wrapper">
        <div class="metrics">
          <div class="metric-container">
            <h1>System Uptime: </br> <?php $uptime=shell_exec("uptime | awk '{print $3 $4}' | sed 's/.$//'");echo($uptime);?></h1>
          </div>
          <div class="metric-container">
            <h1>Current Soil Moisture : </br> <?php $moisture=shell_exec("awk -F ',' '{last_value = $3} END {print last_value}' data.csv"); echo($moisture);?>%</h1>
          </div>
          <div class="metric-container">
            <h1>Total Water Dispensed : </br> <?php $water=shell_exec("awk -F ',' '{Total=Total+$7} END{print Total}' data.csv"); echo($water);?> mL</h1>
          </div>
        </div>
        <div class="chart-flex">
          <div class="chart-container">
            <canvas id="soil"></canvas>
          </div>
          <div class="chart-container">
            <canvas id="temperature"></canvas>
          </div>
        </div>
        <div class="chart-flex">
          <div class="chart-container">
            <canvas id="humidity"></canvas>
          </div>
          <div class="chart-container">
            <canvas id="nitrogen"></canvas>
          </div>
        </div>
        <div class="chart-flex">
          <div class="chart-container">
            <canvas id="phosphorus"></canvas>
          </div>
          <div class="chart-container">
            <canvas id="potassium"></canvas>
          </div> 
        </div>
        <div class="water-cont">
          <div class="chart-container">
            <canvas id="waterDispensed"></canvas>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>