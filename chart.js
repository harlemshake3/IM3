
let luzernChart, churChart, locarnoChart;
let uvIndices = {
    Luzern: 0,
    Chur: 0,
    Locarno: 0
};

let currentChartIndex = 0; 
const chartContainers = ['luzern-container', 'chur-container', 'locarno-container'];


function updateSectionBackground(canvasId, uvIndex) {
    const containerId = canvasId.replace('uvIndex', '').toLowerCase() + '-container';
    const container = document.getElementById(containerId);
    const textBoxId = canvasId.replace('uvIndex', '').toLowerCase() + '-text';
    const textBox = document.getElementById(textBoxId);

    
    let backgroundColor;
    let uvMessage;

   
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

    
    container.style.background = backgroundColor;


    textBox.textContent = uvMessage;
}

document.addEventListener('DOMContentLoaded', function () {
    fetchUVData();
    showChart(currentChartIndex); 
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


function loadDataForDate(selectedDate, data) {
   
    const luzern_d = new Array(24).fill(null), chur_d = new Array(24).fill(null), locarno_d = new Array(24).fill(null);
    const label_d = Array.from({ length: 24 }, (_, hour) => `${hour}:00`); 

    data.forEach(function (datapoint) {
        const [date, time] = datapoint.data.split(' '); 
        const hour = parseInt(time.split(':')[0], 10);  

        if (date === selectedDate) {
            if (datapoint.location === 'Lucerne') {
                luzern_d[hour] = datapoint.kondition; 
            }
            if (datapoint.location === 'Chur') {
                chur_d[hour] = datapoint.kondition;
            }
            if (datapoint.location === 'Locarno') {
                locarno_d[hour] = datapoint.kondition; 
            }
        }
    });

 
    const luzernAverageUV = calculateAverageUV(luzern_d);
    const churAverageUV = calculateAverageUV(chur_d);
    const locarnoAverageUV = calculateAverageUV(locarno_d);

    createChart('uvIndexLuzern', 'Luzern', luzern_d, label_d, luzernChart, luzernAverageUV);
    createChart('uvIndexChur', 'Chur', chur_d, label_d, churChart, churAverageUV);
    createChart('uvIndexLocarno', 'Locarno', locarno_d, label_d, locarnoChart, locarnoAverageUV);
}


function createChart(canvasId, location, data, labels, chartInstance, averageUVIndex) {
    const ctx = document.getElementById(canvasId).getContext('2d');

 
    if (chartInstance) {
        chartInstance.destroy();
    }


    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, 
            datasets: [{
                label: location,
                data: data,
                borderColor: 'rgba(46, 193, 240 )', 
                backgroundColor: 'transparent',
                borderWidth: 4,
                spanGaps: true  
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category', 
                    title: {
                        display: true,
                        text: 'Time of Day (24h)'
                    },
                    grid: {
                        display: true, 
                        color: 'rgba(0, 0, 0, 0.1)' 
                    }
                },
                y: {
                    beginAtZero: true,
                    min: 1,
                    max: 10,
                    title: {
                        display: true,
                        text: 'Wolken Index (1 = sonnig, 10 = bewölkt)'  
                    },
                    grid: {
                        display: true, 
                        color: 'rgba(0, 0, 0, 0.1)' 
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'black', 
                    }
                }
            },
            layout: {
                padding: 0 
            }
        }
    });


    updateSectionBackground(canvasId, averageUVIndex);

  
    if (canvasId === 'uvIndexLuzern') {
        luzernChart = chartInstance;
    } else if (canvasId === 'uvIndexChur') {
        churChart = chartInstance;
    } else if (canvasId === 'uvIndexLocarno') {
        locarnoChart = chartInstance;
    }
}


function calculateAverageUV(data) {
    const filteredData = data.filter(value => value !== null); 
    if (filteredData.length === 0) return 0; 

    const sum = filteredData.reduce((acc, value) => acc + value, 0);
    return sum / filteredData.length;
}

function showChart(index) {
    chartContainers.forEach((containerId, i) => {
        const container = document.getElementById(containerId);
        container.style.display = i === index ? 'block' : 'none'; 
    });
}

function nextChart() {
    currentChartIndex = (currentChartIndex + 1) % chartContainers.length; 
    showChart(currentChartIndex);
}


function prevChart() {
    currentChartIndex = (currentChartIndex - 1 + chartContainers.length) % chartContainers.length; 
    showChart(currentChartIndex);
}

function showChart(index) {
    chartContainers.forEach((containerId, i) => {
        const container = document.getElementById(containerId);
        
        if (i === index) {
            container.style.display = 'block';
            setTimeout(() => container.classList.add('active'), 10); 
        } else {
            container.classList.remove('active');
            setTimeout(() => container.style.display = 'none', 500); 
        }
    });
}