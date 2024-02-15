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
    window.linearRegressionCoefficients = { a0, a1 };
    // Create the linear regression equation
    const equation = `y = ${a0.toFixed(3)} ${a1 < 0 ? '-' : '+'} ${Math.abs(a1).toFixed(3)}x`;

    // Display equation in the Results section
    document.getElementById('results').innerHTML = `<p>Best Fit Line Equation: ${equation}</p>`;

    // Generate data points for best-fit line spanning the entire graph area (0 to 100 for both X and Y)
    const minX = 0;
    const maxX = 100;
    const minY = a0 + a1 * minX;
    const maxY = a0 + a1 * maxX;

    // Add best-fit line to the chart
    window.chart.data.datasets.push({
        label: 'Best Fit Line',
        data: [{ x: minX, y: minY }, { x: maxX, y: maxY }],
        type: 'line', // Set type to 'line' to ensure it's displayed as a line
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointRadius: 0,
        fill: false
    });

    // Update the chart
    window.chart.update();
}


// Function to toggle residuals
function toggleResiduals() {
    const residualsCheckbox = document.getElementById('residuals-checkbox');

    if (residualsCheckbox.checked) {
        // If checkbox is checked, calculate and display residuals
        calculateResiduals();
    } else {
        // If checkbox is unchecked, remove residuals from the chart
        removeResiduals();
    }
}


// Function to calculate residuals
function calculateResiduals() {
    const residualsDataset = {
        label: 'Residuals',
        data: [],
        type: 'line',
        borderColor: 'rgba(255, 0, 0, 0.7)', // Red color for residuals
        borderWidth: 1,
        fill: false
    };
    
    for (const point of data) {
        
        residualsDataset.data.push(point);
        // Add the corresponding point on the X-axis (residual line point)

        residualsDataset.data.push({ x: point.x, y: 0 });


    }

    // Add residuals to the chart
    window.chart.data.datasets.push(residualsDataset);
    window.chart.update();
}

// ... (existing code)

// Function to calculate Y value using the linear regression equation
function calculateYValue(xValue) {
    const coefficients = window.linearRegressionCoefficients;

    // Check if coefficients are available
    if (!coefficients) {
        alert('Please calculate the best-fit line first.');
        return;
    }

    // Use the linear regression equation to calculate Y value
    const { a0, a1 } = coefficients;
    const YValue = a0 + a1 * xValue;

    // Add the predicted Y value to the Results section
    document.getElementById('results').innerHTML += `<p>Predicted Stock Price for Given Date (${xValue}): ${YValue.toFixed(3)}</p>`;

    return YValue;
}

// Function to predict Y value for a given date
function predict() {
    const dateInput = parseFloat(document.getElementById('date-input').value);

    if (isNaN(dateInput)) {
        alert('Please enter a valid numeric value for the given date.');
        return;
    }

    calculateYValue(dateInput);
}

// ... (existing code)


// Function to remove residuals
function removeResiduals() {
    const datasets = window.chart.data.datasets;
    window.chart.data.datasets = datasets.filter(dataset => dataset.label !== 'Residuals');
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


