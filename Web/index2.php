<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="all.css">
    <link rel="stylesheet" href="dash.css" />
    <script src="./chartmin/chart.min.js"></script>
    <script src="./node_modules/d3/dist/d3.js"></script>
    <title>Aqua-AI</title>
</head>

<body>
<?php
    function readCSV() {
        $csvFile = fopen(__DIR__ . '/Users/adithya/Downloads/data.csv', 'r');
        $data = [];
        $headers = fgetcsv($csvFile);

        while ($row = fgetcsv($csvFile)) {
            $data[] = array_combine($headers, $row);
        }

        fclose($csvFile);

        return json_encode($data);
    }
?>

    <script>
        function updateChart(containerId, dataKey, yAxisLabel, color, jsonData) {
            let data = [];
            let labels = [];
            let startIndex = Math.max(0, jsonData.length - 15);

            for (let i = startIndex; i < jsonData.length; i++) {
                let value = parseFloat(jsonData[i][dataKey]);
                data.push(value);
                labels.push(i + 1);
            }

            let canvas = document.getElementById(containerId);
            if (!canvas) {
                console.error(`Canvas element with ID ${containerId} not found.`);
                return;
            }

            let ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error(`Unable to get 2D context for canvas with ID ${containerId}.`);
                return;
            }

            let chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        fill: false,
                        borderColor: color,
                        borderWidth: 2,
                        pointBackgroundColor: color,
                        pointRadius: 4,
                        pointHoverRadius: 5,
                        label: yAxisLabel
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
                                text: yAxisLabel,
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

        function fetchDataAndUpdateCharts() {
            let jsonData = <?php echo readCSV(); ?>;

            updateChart('soilChart', 'Soil_Moisture', 'Soil Moisture', 'rgba(75, 192, 192, 1)', jsonData);
            updateChart('temperatureChart', 'Temperature', 'Temperature', 'rgba(255, 99, 132, 1)', jsonData);
            updateChart('humidityChart', 'Humidity', 'Humidity', 'rgba(255, 99, 71, 1)', jsonData);
            updateChart('nitrogenChart', 'Nitrogen', 'Nitrogen', 'rgba(30, 144, 255, 1)', jsonData);
            updateChart('phosphorousChart', 'Phosphorus', 'Phosphorus', 'rgba(255, 215, 0, 1)', jsonData);
            updateChart('potassiumChart', 'Potassium', 'Potassium', 'rgba(128, 0, 128, 1)', jsonData);
            updateChart('waterDispensedChart', 'Water_Dispensed', 'Water Dispensed', 'rgba(0, 128, 0, 1)', jsonData);
        }

        function loadDataAndUpdateCharts() {
            fetchDataAndUpdateCharts();

            setInterval(function () {
                fetchDataAndUpdateCharts();
            }, 10000);
        }

        loadDataAndUpdateCharts();
    </script>

    <input type="checkbox" id="nav-toggle">
    <nav class="nav">
        <div class="sidebar-brand">
            <h1>
                <span
                    ><img src="res/logo.png" width="70px" height="70px" alt=""
                /></span><span>Aqua-AI</span>
            </h1>
        </div>
        <div class="sidebar-menu">
            <ul>
                <li>
                    <a href="index.php" class="active"
                        ><span class="fa-solid fa-house"></span
                        ><span>Dashboard</span></a
                    >
                </li>
                <li>
                    <a href="settings.php"
                        ><span class="fa-solid fa-gear"></span
                        ><span>Settings</span></a
                    >
                </li>
                <li>
                    <a href="wifi.php"
                        ><span class="fa-solid fa-wifi"></span
                        ><span>WiFi Settings</span></a
                    >
                </li>
            </ul>
        </div>
    </nav>
    <div class="hidnav">
        <ul>
            <li>
                <a href="index.php"
                    ><span class="fa-solid fa-house"></span
                    ><span>Dashboard</span></a
                >
            </li>
            <li>
                <a href="settings.php"
                    ><span class="fa-solid fa-gear"></span
                    ><span>Settings</span></a
                >
            </li>
            <li>
                <a href="wifi.php"
                    ><span class="fa-solid fa-wifi"></span
                    ><span>WiFi Settings</span></a
                >
            </li>
            <li>
                <a href="index.php"
                    ><span class="fa-solid fa-close"></span
                    ><span>Close</span></a
                >
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
                    <h1>
                        System Uptime: </br> <?php
                            $uptime = shell_exec(
                                "uptime | awk '{print $3 $4}' | sed 's/.$//'"
                            );
                            echo ($uptime);
                        ?>
                    </h1>
                </div>
                <div class="metric-container">
                    <h1>
                        Current Soil Moisture : </br>
                        <?php
                        $csvFile = fopen('/Users/adithya/Downloads/data.csv', 'r');
                        if ($csvFile === false) {
                            echo 'N/A';
                        } else {
                            $headers = fgetcsv($csvFile);
                            $lastRow = null;

                            while ($row = fgetcsv($csvFile)) {
                                $lastRow = $row;
                            }

                            fclose($csvFile);

                            $moisture = isset($lastRow) ? $lastRow[array_search('Soil_Moisture', $headers)] : 'N/A';
                            echo $moisture . '%';
                        }
                        ?>
                    </h1>
                </div>
                <div class="metric-container">
                    <h1>
                        Total Water Dispensed : </br>
                        <?php
                        $csvFile = fopen('/Users/adithya/Downloads/data.csv', 'r');
                        if ($csvFile === false) {
                            echo 'N/A';
                        } else {
                            $headers = fgetcsv($csvFile);
                            $totalWater = 0;

                            while ($row = fgetcsv($csvFile)) {
                                $totalWater += isset($row[6]) ? floatval($row[6]) : 0;
                            }

                            fclose($csvFile);

                            echo $totalWater . ' mL';
                        }
                        ?>
                    </h1>
                </div>
            </div>
            <div class="chart-flex">
                <div class="chart-container">
                    <canvas id="soilChart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="temperatureChart"></canvas>
                </div>
            </div>
            <div class="chart-flex">
                <div class="chart-container">
                    <canvas id="humidityChart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="nitrogenChart"></canvas>
                </div>
            </div>
            <div class="chart-flex">
                <div class="chart-container">
                    <canvas id="phosphorousChart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="potassiumChart"></canvas>
                </div>
            </div>
            <div class="water-cont">
                <div class="chart-container">
                    <canvas id="waterDispensedChart"></canvas>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
