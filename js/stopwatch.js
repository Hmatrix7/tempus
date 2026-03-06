// Time variables
let milliseconds = 0;
let seconds = 0;
let minutes = 0;
let hours = 0;

let interval = null;
let laps = []; // Array to store laps

const circle = document.querySelector(".circle");
const display = document.getElementById("display");

// -----------------------------
// LOAD SAVED SESSION
// -----------------------------
window.onload = function () {
    const savedTime = localStorage.getItem("stopwatchTime");
    const savedLaps = localStorage.getItem("stopwatchLaps");

    if (savedTime) {
        const parsed = JSON.parse(savedTime);

        milliseconds = parsed.milliseconds;
        seconds = parsed.seconds;
        minutes = parsed.minutes;
        hours = parsed.hours;

        updateDisplay();
    }

    if (savedLaps) {
        laps = JSON.parse(savedLaps);
        renderLaps();
    }
};

// -----------------------------
// SAVE SESSION
// -----------------------------
function saveTime() {
    localStorage.setItem(
        "stopwatchTime",
        JSON.stringify({ milliseconds, seconds, minutes, hours })
    );
}

// -----------------------------
// UPDATE DISPLAY
// -----------------------------
function updateDisplay() {
    let h = hours.toString().padStart(2, "0");
    let m = minutes.toString().padStart(2, "0");
    let s = seconds.toString().padStart(2, "0");
    let ms = milliseconds.toString().padStart(2, "0");

    display.innerText = `${h}:${m}:${s}:${ms}`;
}

// -----------------------------
// START
// -----------------------------
function start() {
    if (interval !== null) return;

    circle.classList.add("running");

    interval = setInterval(() => {
        milliseconds++;

        if (milliseconds === 100) {
            milliseconds = 0;
            seconds++;
        }

        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }

        if (minutes === 60) {
            minutes = 0;
            hours++;
        }

        updateDisplay();
        saveTime(); // Save continuously
    }, 10);
}

// -----------------------------
// STOP
// -----------------------------
function stop() {
    clearInterval(interval);
    interval = null;

    circle.classList.remove("running");
    saveTime();
}

// -----------------------------
// RESET
// -----------------------------
function reset() {
    stop();

    milliseconds = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;

    laps = []; // Clear laps
    updateDisplay();
    renderLaps();
    saveTime();
    localStorage.removeItem("stopwatchLaps"); // Clear saved laps
}

// -----------------------------
// LAP
// -----------------------------
function lap() {
    let h = hours.toString().padStart(2, "0");
    let m = minutes.toString().padStart(2, "0");
    let s = seconds.toString().padStart(2, "0");
    let ms = milliseconds.toString().padStart(2, "0");

    const currentTime = `${h}:${m}:${s}:${ms}`;
    laps.push(currentTime);

    renderLaps();
    localStorage.setItem("stopwatchLaps", JSON.stringify(laps));
}

// -----------------------------
// RENDER LAPS
// -----------------------------
function renderLaps() {
    let lapsContainer = document.getElementById("laps");
    if (!lapsContainer) {
        // Create container if it doesn't exist
        lapsContainer = document.createElement("div");
        lapsContainer.id = "laps";
        document.body.appendChild(lapsContainer);
    }

    lapsContainer.innerHTML = "";

    laps.forEach((lapTime, index) => {
        const lapElement = document.createElement("div");
        lapElement.innerText = `Lap ${index + 1}: ${lapTime}`;
        lapsContainer.appendChild(lapElement);
    });
}
// -----------------------------
// CLEAR LAPS
// -----------------------------
function clearLaps() {
    laps = []; // Clear laps array
    renderLaps(); // Update UI
    localStorage.removeItem("stopwatchLaps"); // Remove from storage
}

function goToDashboard() {
    window.location.href = "index.html";
}