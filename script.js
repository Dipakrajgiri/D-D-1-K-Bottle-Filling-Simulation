let simulationInterval;
let timeElapsed = 0;
let bottlesServed = 0;
let isMachineBusy = false;

function initializeSimulation() {
  const initialBottles = parseInt(
    document.getElementById("initialBottles").value
  );
  const arrivalRate = parseFloat(document.getElementById("arrivalRate").value);
  const serviceRate = parseFloat(document.getElementById("serviceRate").value);
  const beltSize = parseInt(document.getElementById("beltSize").value);

  let conveyorBelt = Array(initialBottles).fill("bottle");
  let idleTime = 0;

  function renderMetrics() {
    document.getElementById("timeElapsed").innerText = timeElapsed;
    document.getElementById("bottlesServed").innerText = bottlesServed;
    document.getElementById("bottlesOnBelt").innerText = conveyorBelt.length;
    const utilization = (
      ((timeElapsed - idleTime) / timeElapsed) *
      100
    ).toFixed(2);
    document.getElementById("serverUtilization").innerText = isNaN(utilization)
      ? 0
      : utilization;
  }

  function renderConveyor() {
    const conveyorDiv = document.getElementById("conveyor");
    conveyorDiv.innerHTML = "";
    conveyorBelt.forEach(() => {
      const bottle = document.createElement("div");
      bottle.classList.add("bottle");
      conveyorDiv.appendChild(bottle);
    });
  }

  function handleArrival() {
    if (
      timeElapsed % Math.round(arrivalRate) === 0 &&
      conveyorBelt.length < beltSize
    ) {
      conveyorBelt.push("bottle");
      console.log(conveyorBelt + "if push hi");
    } else if (
      timeElapsed % Math.round(arrivalRate) === 0 &&
      conveyorBelt.length >= beltSize
    ) {
      console.log(conveyorBelt + "elif push");
      document.getElementById("overflowMessage").classList.remove("hidden");
      clearInterval(simulationInterval);
    } else {
    }
  }

  function handleService() {
    if (!isMachineBusy && conveyorBelt.length > 0) {
      isMachineBusy = true;

      conveyorBelt.shift();
      console.log(conveyorBelt + "remove");
      bottlesServed++;

      document.getElementById("machineState").src = "assets/server_serving.png";

      setTimeout(() => {
        isMachineBusy = false;

        if (conveyorBelt.length > 0) {
          handleService();
        } else {
          document.getElementById("machineState").src =
            "assets/server_idle.png";
        }
      }, serviceRate * 1000);
    } else if (!isMachineBusy) {
      idleTime++;
    }
  }

  function simulateStep() {
    timeElapsed++;
    handleArrival();
    handleService();
    renderMetrics();
    renderConveyor();
  }

  renderConveyor();
  handleArrival();
  handleService();
  renderMetrics();
  renderConveyor();
  simulationInterval = setInterval(simulateStep, 1000);
}

document.getElementById("startSimulation").addEventListener("click", () => {
  clearInterval(simulationInterval);
  timeElapsed = 0;
  bottlesServed = 0;

  isMachineBusy = false;
  document.getElementById("overflowMessage").classList.add("hidden");
  initializeSimulation();
});
