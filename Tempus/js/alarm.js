let alarms = JSON.parse(localStorage.getItem("alarms")) || [];
let activeTimeouts = [];
let beepInterval = null;
let selectedAlarmId = null;

const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const amBtn = document.getElementById("amBtn");
const pmBtn = document.getElementById("pmBtn");
const setBtn = document.getElementById("setAlarm");
const stopBtn = document.getElementById("stopAlarmBtn");

const circle = document.querySelector(".circle");
const display = document.getElementById("alarmDisplay");
const alarmList = document.getElementById("alarmList");

let isPM = false;

/* -----------------------
   LIVE CLOCK
----------------------- */

function updateClock() {
    const now = new Date();
    display.textContent = now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();

/* -----------------------
   AM / PM TOGGLE
----------------------- */

amBtn.addEventListener("click", () => {
    isPM = false;
    amBtn.classList.add("active");
    pmBtn.classList.remove("active");
});

pmBtn.addEventListener("click", () => {
    isPM = true;
    pmBtn.classList.add("active");
    amBtn.classList.remove("active");
});

/* -----------------------
   SET ALARM
----------------------- */

setBtn.addEventListener("click", () => {

    const hour = parseInt(hourInput.value);
    const minute = parseInt(minuteInput.value);

    if (isNaN(hour) || isNaN(minute)) return;

    let hour24 = hour;

    if (isPM && hour !== 12) hour24 += 12;
    if (!isPM && hour === 12) hour24 = 0;

    const formatted =
        hour24.toString().padStart(2, "0") + ":" +
        minute.toString().padStart(2, "0");

    const newAlarm = {
        id: Date.now(),
        time: formatted,
        active: true,
        description: ""
    };

    alarms.push(newAlarm);
    saveAlarms();
    renderAlarms();
    scheduleAlarm(newAlarm);

    hourInput.value = "";
    minuteInput.value = "";
});

/* -----------------------
   SAVE
----------------------- */

function saveAlarms() {
    localStorage.setItem("alarms", JSON.stringify(alarms));
}

/* -----------------------
   RENDER
----------------------- */

function renderAlarms() {
    alarmList.innerHTML = "";

    alarms.forEach(alarm => {

        const div = document.createElement("div");
        div.className = "alarm-item";

        div.innerHTML = `
            <span>${alarm.time}</span>
            <div>
                <button onclick="toggleAlarm(${alarm.id})">
                    ${alarm.active ? "ON" : "OFF"}
                </button>
                <button class="delete-btn" onclick="deleteAlarm(${alarm.id})">
                    X
                </button>
            </div>
        `;

        // Click entire alarm to open modal (except buttons)
        div.addEventListener("click", (e) => {
            if (e.target.tagName !== "BUTTON") {
                openAlarmModal(alarm.id);
            }
        });

        alarmList.appendChild(div);
    });
}

/* -----------------------
   TOGGLE
----------------------- */

function toggleAlarm(id) {
    const alarm = alarms.find(a => a.id === id);
    alarm.active = !alarm.active;

    saveAlarms();
    renderAlarms();

    if (alarm.active) {
        scheduleAlarm(alarm);
    }
}

/* -----------------------
   DELETE
----------------------- */

function deleteAlarm(id) {
    alarms = alarms.filter(a => a.id !== id);
    saveAlarms();
    renderAlarms();
}

/* -----------------------
   OFFLINE SOUND
----------------------- */

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

/* -----------------------
   SCHEDULE
----------------------- */

function scheduleAlarm(alarmObj) {

    if (!alarmObj.active) return;

    const now = new Date();
    const alarm = new Date();

    const [hours, minutes] = alarmObj.time.split(":");

    alarm.setHours(hours);
    alarm.setMinutes(minutes);
    alarm.setSeconds(0);

    if (alarm <= now) {
        alarm.setDate(alarm.getDate() + 1);
    }

    const timeout = setTimeout(() => {

        circle.classList.add("ringing");

        beepInterval = setInterval(playBeep, 700);

        alarmObj.active = false;
        saveAlarms();
        renderAlarms();

    }, alarm - now);

    activeTimeouts.push(timeout);
}

/* -----------------------
   STOP ALARM
----------------------- */

stopBtn.addEventListener("click", () => {

    if (beepInterval) {
        clearInterval(beepInterval);
        beepInterval = null;
    }

    circle.classList.remove("ringing");
});

/* -----------------------
   MODAL FUNCTIONS
----------------------- */

function openAlarmModal(id) {
    selectedAlarmId = id;
    const alarm = alarms.find(a => a.id === id);

    document.getElementById("modalTime").textContent = alarm.time;
    document.getElementById("modalDescription").value = alarm.description || "";

    document.getElementById("alarmModal").style.display = "flex";

    document.querySelector(".layout").classList.add("blur");
}

function closeModal() {
    document.getElementById("alarmModal").style.display = "none";
    document.querySelector(".layout").classList.remove("blur");
}

function saveDescription() {
    const alarm = alarms.find(a => a.id === selectedAlarmId);
    alarm.description = document.getElementById("modalDescription").value;

    saveAlarms();
    closeModal();
}

/* Close modal when clicking outside */
document.addEventListener("click", function(e) {
    const modal = document.getElementById("alarmModal");
    if (e.target === modal) {
        closeModal();
    }
});

/* ESC key close */
document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
        closeModal();
    }
});

/* -----------------------
   INIT
----------------------- */

window.onload = function () {
    renderAlarms();
    alarms.forEach(scheduleAlarm);
};

function goToDashboard() {
    window.location.href = "index.html"; 
    // Change to "dashboard.html" if that's your file name
}