// Global variables to store chart instances and UV indices
let luzernChart, churChart, locarnoChart;
let uvIndices = {
    Luzern: 0,
    Chur: 0,
    Locarno: 0
};

// Global variable for managing the carousel
let currentChartIndex = 0; // Index of the currently displayed chart
const chartContainers = ['luzern-container', 'chur-container', 'locarno-container'];

// Function to update the section's background color and UV text box based on the UV index
function updateSectionBackground(canvasId, uvIndex) {
    const containerId = canvasId.replace('uvIndex', '').toLowerCase() + '-container';
    const container = document.getElementById(containerId);
    const textBoxId = canvasId.replace('uvIndex', '').toLowerCase() + '-text';
    const textBox = document.getElementById(textBoxId);

    // Dynamic gradient background and message based on UV index
    let backgroundColor;
    let uvMessage;

    // Adjust for UV Index where 1 is sunny and 10 is cloudy
    if (uvIndex <= 3) {
        backgroundColor = 'linear-gradient(135deg, #f7797d, #fbc2eb)'; // Sunny (Bright Yellow/Pink)
        uvMessage = `☀️ Viel Sonne in ${containerId.replace('-container', '')}! Get ready to tan!`;
    } else if (uvIndex <= 7) {
        backgroundColor = 'linear-gradient(135deg, #ffb347, #ffcc33)'; // Partly Cloudy (Yellow/Orange)
        uvMessage = `🌤️  Teilweise bewölkt in ${containerId.replace('-container', '')}`;
    } else {
        backgroundColor = 'linear-gradient(135deg, #d3d3d3 0%, #a9a9a9 50%, #808080 100%)'; // Cloudy (Gray)
        uvMessage = `☁️ Sehr bewölkt in ${containerId.replace('-container', '')}. No sun no tan:(`;
    }

    // Apply the background gradient to the section
    container.style.background = backgroundColor;

    // Update the text box with the UV message (including the emoji)
    textBox.textContent = uvMessage;
}

document.addEventListener('DOMContentLoaded', function () {
    fetchUVData();
    showChart(currentChartIndex); // Display the initial chart when page loads
});

function fetchUVData() {
    fetch('unload.php')
        .then(response => response.json())
        .then(data => {
            const currentDate = new Date().toISOString().split('T')[0];
            loadDataForDate(currentDate, data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// New function to fetch UV data for the selected date
function fetchUVDataByDate() {
    const selectedDate = document.getElementById('datePicker').value;

    if (!selectedDate) {
        alert("Please select a date!");
        return;
    }

    fetch('unload.php')
        .then(response => response.json())
        .then(data => {
            loadDataForDate(selectedDate, data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Helper function to load and display data for a specific date
function loadDataForDate(selectedDate, data) {
    // Ensure that we process the data only for the selected date
    const luzern_d = new Array(24).fill(null), chur_d = new Array(24).fill(null), locarno_d = new Array(24).fill(null);
    const label_d = Array.from({ length: 24 }, (_, hour) => `${hour}:00`); // Array of hours '00:00', '01:00', ..., '23:00'

    data.forEach(function (datapoint) {
        const [date, time] = datapoint.data.split(' '); // Split into date and time
        const hour = parseInt(time.split(':')[0], 10);  // Extract the hour part (0-23)

        if (date === selectedDate) {
            if (datapoint.location === 'Lucerne') {
                luzern_d[hour] = datapoint.kondition; // UV-Index for Lucerne at this hour
            }
            if (datapoint.location === 'Chur') {
                chur_d[hour] = datapoint.kondition; // UV-Index for Chur at this hour
            }
            if (datapoint.location === 'Locarno') {
                locarno_d[hour] = datapoint.kondition; // UV-Index for Locarno at this hour
            }
        }
    });

    // Calculate the average UV index for each location
    const luzernAverageUV = calculateAverageUV(luzern_d);
    const churAverageUV = calculateAverageUV(chur_d);
    const locarnoAverageUV = calculateAverageUV(locarno_d);

    // Update the charts with the filtered data
    createChart('uvIndexLuzern', 'Luzern', luzern_d, label_d, luzernChart, luzernAverageUV);
    createChart('uvIndexChur', 'Chur', chur_d, label_d, churChart, churAverageUV);
    createChart('uvIndexLocarno', 'Locarno', locarno_d, label_d, locarnoChart, locarnoAverageUV);
}

// Function to create or update charts with location-specific average UV index
function createChart(canvasId, location, data, labels, chartInstance, averageUVIndex) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Destroy the existing chart instance if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Create a new chart
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Hours of the day '00:00', '01:00', ...
            datasets: [{
                label: location,
                data: data,
                borderColor: 'rgba(46, 193, 240 )', // Line color
                backgroundColor: 'transparent', // Line background transparent
                borderWidth: 4,
                spanGaps: true  // Connects data points with gaps (missing data)
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category', // Use category scale for hour labels
                    title: {
                        display: true,
                        text: 'Time of Day (24h)'
                    },
                    grid: {
                        display: true, // Show grid lines
                        color: 'rgba(0, 0, 0, 0.1)' // Grid line color
                    }
                },
                y: {
                    beginAtZero: true,
                    min: 1,
                    max: 10,
                    title: {
                        display: true,
                        text: 'UV Index (1 = sunny, 10 = cloudy)'  // Corrected UV Index labels
                    },
                    grid: {
                        display: true, // Show grid lines
                        color: 'rgba(0, 0, 0, 0.1)' // Grid line color
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'black', // Set legend text color
                    }
                }
            },
            layout: {
                padding: 0 // Remove extra padding around the chart
            }
        }
    });

    // Apply background color based on the average UV index for this location
    updateSectionBackground(canvasId, averageUVIndex);

    // Save the new chart instance to the global variable
    if (canvasId === 'uvIndexLuzern') {
        luzernChart = chartInstance;
    } else if (canvasId === 'uvIndexChur') {
        churChart = chartInstance;
    } else if (canvasId === 'uvIndexLocarno') {
        locarnoChart = chartInstance;
    }
}

// Function to calculate the average UV index for a dataset
function calculateAverageUV(data) {
    const filteredData = data.filter(value => value !== null); // Filter out null values
    if (filteredData.length === 0) return 0; // Avoid division by zero

    const sum = filteredData.reduce((acc, value) => acc + value, 0);
    return sum / filteredData.length;
}

/* Carousel Functionality */

// Function to display the current chart based on index
function showChart(index) {
    chartContainers.forEach((containerId, i) => {
        const container = document.getElementById(containerId);
        container.style.display = i === index ? 'block' : 'none'; // Show current chart, hide others
    });
}

// Function to navigate to the next chart
function nextChart() {
    currentChartIndex = (currentChartIndex + 1) % chartContainers.length; // Loop to first after last
    showChart(currentChartIndex);
}

// Function to navigate to the previous chart
function prevChart() {
    currentChartIndex = (currentChartIndex - 1 + chartContainers.length) % chartContainers.length; // Loop to last after first
    showChart(currentChartIndex);
}

function showChart(index) {
    chartContainers.forEach((containerId, i) => {
        const container = document.getElementById(containerId);
        
        if (i === index) {
            container.style.display = 'block'; // Show active chart
            setTimeout(() => container.classList.add('active'), 10); // Add the fade-in effect after a short delay
        } else {
            container.classList.remove('active'); // Remove the fade effect for inactive charts
            setTimeout(() => container.style.display = 'none', 500); // Hide after fade-out completes
        }
    });
}