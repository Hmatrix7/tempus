// ---------------------------
// World Clock JS
// ---------------------------
const cities = [
    { name: "New York", tz: "America/New_York", top: "20%", left: "22%" },
    { name: "London", tz: "Europe/London", top: "18%", left: "50%" },
    { name: "Tokyo", tz: "Asia/Tokyo", top: "22%", left: "85%" },
    { name: "Sydney", tz: "Australia/Sydney", top: "75%", left: "90%" },
    { name: "Nairobi", tz: "Africa/Nairobi", top: "50%", left: "65%" }
];

const worldMap = document.getElementById("worldMap");
const cityTime = document.getElementById("cityTime");
let clockInterval = null;

// Create interactive city dots
cities.forEach(city => {
    const dot = document.createElement("div");
    dot.classList.add("city-dot");
    dot.style.top = city.top;
    dot.style.left = city.left;
    dot.title = city.name;

    dot.addEventListener("click", () => {
        // Stop previous clock if any
        if(clockInterval) clearInterval(clockInterval);

        // Update time every second
        clockInterval = setInterval(() => {
            const now = new Date().toLocaleTimeString("en-US", { timeZone: city.tz, hour12: false });
            cityTime.textContent = `${city.name}: ${now}`;
        }, 1000);

        // Show current time immediately
        const now = new Date().toLocaleTimeString("en-US", { timeZone: city.tz, hour12: false });
        cityTime.textContent = `${city.name}: ${now}`;
    });

    worldMap.appendChild(dot);
});