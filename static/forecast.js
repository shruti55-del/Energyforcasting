async function loadForecast() {

    try {

        const response = await fetch("/api/forecast");
        const data = await response.json();

        const labels = data.map(item => item.time);
        const values = data.map(item => item.value);

        const ctx = document.getElementById("forecastChart");

        new Chart(ctx, {
            type: "line",

            data: {
                labels: labels,

                datasets: [{
                    label: "Energy Consumption (kW)",
                    data: values,
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }]
            },

            options: {
                responsive: true,

                plugins: {
                    legend: {
                        display: true
                    }
                },

                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Energy (kW)"
                        }
                    },

                    x: {
                        title: {
                            display: true,
                            text: "Time"
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Forecast loading error:", error);
    }
}

loadForecast();
async function loadWeeklyForecast() {

    try {

        const response = await fetch("/api/weekly-forecast");
        const data = await response.json();

        const labels = data.map(item => item.day);
        const values = data.map(item => item.value);

        const ctx = document.getElementById("weeklyForecastChart");

        new Chart(ctx, {
            type: "bar",

            data: {
                labels: labels,

                datasets: [{
                    label: "Daily Energy Consumption (kW)",
                    data: values,
                    borderWidth: 1
                }]
            },

            options: {
                responsive: true,

                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Energy (kW)"
                        }
                    },

                    x: {
                        title: {
                            display: true,
                            text: "Day"
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Weekly forecast error:", error);
    }
}

loadWeeklyForecast();