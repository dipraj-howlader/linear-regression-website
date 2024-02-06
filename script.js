let data = []; // Array to store input data points

document.getElementById('add-data-btn').addEventListener('click', addData);
document.getElementById('reset-btn').addEventListener('click', resetData);
document.getElementById('best-fit-checkbox').addEventListener('change', toggleBestFitLine);

// Function to reset data
function resetData() {
    // Clear data array
    data = [];

    // Clear result section
    document.getElementById('results').innerHTML = '';

    // Update graph to clear the chart
    updateGraph();
}

// Function to add data
function addData() {
    const xValue = parseFloat(document.getElementById('x-input').value);
    const yValue = parseFloat(document.getElementById('y-input').value);

    // Check if input is valid
    if (isNaN(xValue) || isNaN(yValue)) {
        alert('Please enter valid numeric values for X and Y.');
        return;
    }

    // Clear input fields
    document.getElementById('x-input').value = '';
    document.getElementById('y-input').value = '';

    data.push({ x: xValue, y: yValue });

    updateGraph();
}

// Function to toggle best-fit line
function toggleBestFitLine() {
    const bestFitCheckbox = document.getElementById('best-fit-checkbox');

    if (bestFitCheckbox.checked) {
        // If checkbox is checked, calculate and display best-fit line
        calculateBestFitLine();
    } else {
        // If checkbox is unchecked, remove best-fit line from the chart
        removeBestFitLine();
    }
}

// Function to calculate best-fit line equation (Simple Linear Regression)
function calculateBestFitLine() {
    const X = data.map(point => point.x);
    const Y = data.map(point => point.y);

    const N = X.length;

    let sumx = 0, sumy = 0, sumx2 = 0, sumxy = 0;
    for (let i = 0; i < N; i++) {
        sumx += X[i];
        sumy += Y[i];
        sumx2 += X[i] ** 2;
        sumxy += X[i] * Y[i];
    }

    const meanx = sumx / N;
    const meany = sumy / N;

    // Calculate linear regression coefficients
    const a1 = (N * sumxy - sumx * sumy) / (N * sumx2 - sumx ** 2);
    const a0 = meany - a1 * meanx;

    // Check if coefficients are valid
    if (isNaN(a0) || isNaN(a1)) {
        document.getElementById('results').innerHTML = '<p>Unable to calculate the best-fit line equation.</p>';
        return;
    }

    // Create the linear regression equation
    const equation = `y = ${a0.toFixed(3)} ${a1 < 0 ? '-' : '+'} ${Math.abs(a1).toFixed(3)}x`;

    // Display equation in the Results section
    document.getElementById('results').innerHTML = `<p>Best Fit Line Equation: ${equation}</p>`;

    // Generate data points for best-fit line (assuming X-axis range from 0 to 100)
    const bestFitLineData = [];
    for (let x = 0; x <= 100; x++) {
        const y = a0 + a1 * x;
        bestFitLineData.push({ x, y });
    }

    // Add best-fit line to the chart
    window.chart.data.datasets.push({
        label: 'Best Fit Line',
        data: bestFitLineData,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointRadius: 0,
        fill: false
    });

    // Update the chart
    window.chart.update();
}

// Function to remove best-fit line
function removeBestFitLine() {
    const datasets = window.chart.data.datasets;
    window.chart.data.datasets = datasets.filter(dataset => dataset.label !== 'Best Fit Line');
    window.chart.update();
}

// Function to update graph
function updateGraph() {
    const ctx = document.getElementById('graph').getContext('2d');

    // Clear previous chart
    if (window.chart) {
        window.chart.destroy();
    }

    // Create new chart
    window.chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Data Points',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: 0,
                    max: 100
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    min: 0,
                    max: 100
                }
            }
        }
    });
}
