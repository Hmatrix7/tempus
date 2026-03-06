let timer;
let totalSeconds = 0;
let remainingSeconds = 0;
let isRunning = false;

const display = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const circle = document.querySelector(".circle");

let beepInterval = null; // for ringing alarm

/* Format Time */
function formatTime(seconds) {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;

    return (
        String(hrs).padStart(2, '0') + ":" +
        String(mins).padStart(2, '0') + ":" +
        String(secs).padStart(2, '0')
    );
}

/* Update Display */
function updateDisplay() {
    display.textContent = formatTime(remainingSeconds);
}

/* Play Oscillator Beep */
function playBeep() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
}

/* Start Timer */
function startTimer() {
    if (isRunning || remainingSeconds <= 0) return;

    isRunning = true;

    timer = setInterval(() => {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay();
        } else {
            clearInterval(timer);
            isRunning = false;

            // Start ringing
            circle.classList.add("ringing");
            beepInterval = setInterval(playBeep, 700); // beep every 0.7 sec
        }
    }, 1000);
}

/* Pause Timer */
function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

/* Reset Timer */
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    remainingSeconds = totalSeconds;
    updateDisplay();

    if (beepInterval) {
        clearInterval(beepInterval);
        beepInterval = null;
    }

    circle.classList.remove("ringing");
}

/* Quick Timer */
function setQuickTimer(minutes) {
    totalSeconds = minutes * 60;
    remainingSeconds = totalSeconds;
    updateDisplay();
}

/* Custom Modal */
function openCustomTime() {
    document.getElementById("customTimeModal").style.display = "flex";
}

function closeCustomTime() {
    document.getElementById("customTimeModal").style.display = "none";
}

function setCustomTime() {
    let minutes = document.getElementById("customMinutes").value;

    if (minutes && minutes > 0) {
        totalSeconds = minutes * 60;
        remainingSeconds = totalSeconds;
        updateDisplay();
        closeCustomTime();
        document.getElementById("customMinutes").value = "";
    }
}

/* Button Events */
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

/* Stop Alarm (Optional) */
circle.addEventListener("click", () => {
    if (beepInterval) {
        clearInterval(beepInterval);
        beepInterval = null;
        circle.classList.remove("ringing");
    }
});

/* Dashboard Navigation */
function goToDashboard() {
    window.location.href = "index.html";
}