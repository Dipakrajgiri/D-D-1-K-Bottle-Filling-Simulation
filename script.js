// Simulation Parameters
let queue = [];
let servedBottles = 0;
let serverBusy = false;
let queueLength = 30;
let arrivalRate = 3;
let serviceRate = 3;
let initialBottles = 5;
let simulationInterval;
let totalTime = 0;
let busyTime = 0;

// DOM elements
const simulateBtn = document.getElementById('simulate-btn');
const conveyorBelt = document.querySelector('.conveyor-belt');
const serverImg = document.getElementById('server-img');
const serverStatus = document.getElementById('server-status');
const servedBottlesElement = document.getElementById('served-bottles');
const queueSizeElement = document.getElementById('queue-size');
const bottleQueueElement = document.getElementById('bottle-queue');
const overflowAlert = document.getElementById('overflow-alert');
const queueBar = document.getElementById('queue-bar');
const serverUtilizationElement = document.getElementById('server-utilization');

// Initialize simulation
function initializeSimulation() {
    queue = new Array(queueLength).fill(null);
    servedBottles = 0;
    serverBusy = false;
    totalTime = 0;
    busyTime = 0;

    // Add initial bottles
    for (let i = 0; i < initialBottles; i++) {
        addBottleToQueue();
    }

    updateUI();
}

// Add bottle to the queue (conveyor belt)
function addBottleToQueue() {
    if (queue.includes(null)) {
        const bottleImage = document.createElement('img');
        bottleImage.src = 'assets/bottle.png';
        conveyorBelt.appendChild(bottleImage);
        queue[queue.indexOf(null)] = 'bottle';
    } else {
        overflowAlert.style.display = 'block';
    }
}

// Serve the bottle from the queue (server processing)
function serveBottle() {
    if (!serverBusy && queue.includes('bottle')) {
        serverBusy = true;
        serverImg.src = 'assets/server_serving.png';
        serverStatus.textContent = 'Server: Serving';

        const bottleIndex = queue.indexOf('bottle');
        queue[bottleIndex] = null;
        conveyorBelt.children[bottleIndex].remove();
        servedBottles++;

        updateUI();

        setTimeout(() => {
            serverBusy = false;
            serverImg.src = 'assets/server_idle.png';
            serverStatus.textContent = 'Server: Idle';
        }, serviceRate * 1000);
    }
}

// Update the UI
function updateUI() {
    const queueCount = queue.filter(x => x).length;
    queueSizeElement.textContent = `Queue Size: ${queueCount}`;
    bottleQueueElement.textContent = `Bottles in Queue: ${queueCount}`;
    servedBottlesElement.textContent = `Served Bottles: ${servedBottles}`;

    const queuePercentage = (queueCount / queueLength) * 100;
    queueBar.style.width = `${queuePercentage}%`;
    if (queuePercentage < 50) queueBar.style.backgroundColor = 'green';
    else if (queuePercentage < 80) queueBar.style.backgroundColor = 'yellow';
    else queueBar.style.backgroundColor = 'red';

    if (queueCount < queueLength) overflowAlert.style.display = 'none';

    // Update server utilization
    totalTime++;
    if (serverBusy) busyTime++;
    const utilization = Math.round((busyTime / totalTime) * 100);
    serverUtilizationElement.textContent = `Server Utilization: ${utilization}%`;
}

// Start the simulation
function startSimulation() {
    initializeSimulation();

    simulationInterval = setInterval(() => {
        addBottleToQueue();
        updateUI();
    }, arrivalRate * 1000);

    setInterval(() => {
        serveBottle();
    }, serviceRate * 1000);
}

// Attach event listener
simulateBtn.addEventListener('click', () => {
    arrivalRate = parseInt(document.getElementById('arrival-rate').value);
    serviceRate = parseInt(document.getElementById('service-rate').value);
    initialBottles = parseInt(document.getElementById('initial-bottles').value);

    startSimulation();
});
