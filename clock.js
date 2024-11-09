// Function to play alarm sound based on selected tone
function playAlarm(tone) {
    const audio = document.getElementById(`alarm-sound${tone}`);
    if (audio) {
        audio.currentTime = 0; // Reset playback position
        audio.play(); // Play the alarm sound
    }
}

// Function to calculate time until the next alarm with repeating days
function calculateTimeUntilNextAlarm(alarmTime, repeatDays) {
    const currentTime = new Date();
    const [hour, minute] = alarmTime.split(":");
    const alarmDate = new Date(currentTime);

    alarmDate.setHours(hour);
    alarmDate.setMinutes(minute);
    alarmDate.setSeconds(0);

    const currentDay = currentTime.getDay(); // Day of the week (0 = Sunday, 1 = Monday, etc.)

    let daysToNextAlarm = null;
    for (let i = 0; i < 7; i++) {
        const dayOffset = (currentDay + i) % 7; // Find the nearest repeat day
        if (repeatDays.includes(dayOffset)) {
            daysToNextAlarm = i;
            break;
        }
    }

    if (daysToNextAlarm === 0 && alarmDate < currentTime) {
        alarmDate.setDate(alarmDate.getDate() + 7); // If the time has passed today, set for next week
    } else {
        alarmDate.setDate(alarmDate.getDate() + daysToNextAlarm); // Set to the correct day
    }

    return alarmDate.getTime() - currentTime.getTime(); // Time until the next alarm
}

// Tab Switching logic
function showContent(contentId) {
    const tabs = ["alarm-content", "stopwatch-content", "timer-content"];
    tabs.forEach(tabId => {
        const content = document.getElementById(tabId);
        content.style.display = tabId === contentId ? "flex" : "none"; // Toggle visibility
    });

    const activeTab = contentId.replace("-content", "-tab");
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active"); // Remove 'active' from all tabs
    });

    document.getElementById(activeTab).classList.add("active"); // Set the active tab
}

// Event listeners for tab switching
document.getElementById("alarm-tab").addEventListener("click", () => {
    showContent("alarm-content");
});

document.getElementById("stopwatch-tab").addEventListener("click", () => {
    showContent("stopwatch-content");
});

document.getElementById("timer-tab").addEventListener("click", () => {
    showContent("timer-content");
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("Back").addEventListener("click", function() {
        window.location.href = "index.html";
    });
});


// Managing the Repeat modal
const repeatModal = document.getElementById("repeat-modal");
const repeatButton = document.getElementById("repeat-button");
const closeModal = document.getElementById("close-modal");

repeatButton.addEventListener("click", () => {
    repeatModal.style.display = "block"; // Open the modal when clicking "Repeat"
});

closeModal.addEventListener("click", () => {
    repeatModal.style.display = "none"; // Close the modal when clicking "x"
});

window.addEventListener("click", (event) => {
    if (event.target === repeatModal) {
        repeatModal.style.display = "none"; // Close if clicked outside the modal
    }
});

// Store the selected repeat days
document.getElementById("apply-repeat").addEventListener("click", () => {
    repeatModal.style.display = "none"; // Close the modal after applying repeat days
    const repeatCheckboxes = Array.from(document.querySelectorAll("#repeat-days input:checked"));
    const repeatDays = repeatCheckboxes.map(cb => parseInt(cb.value, 10));
    window.repeatDays = repeatDays; // Store the repeat days globally
});

// Setting the alarm with a toggle switch
document.getElementById("set-alarm-button").addEventListener("click", () => {
    const alarmTime = document.getElementById("alarm-time").value;
    const alarmTone = document.getElementById("alarm-tone").value;
    const repeatDays = window.repeatDays || [];
    
    if (alarmTime && repeatDays.length > 0) {
        const alarmList = document.getElementById("alarm-list");
        const li = document.createElement("li");
        li.textContent = `Alarm set for: ${alarmTime}, Repeats on: ${repeatDays.join(", ")}`;

        // Toggle switch for alarm on/off
        const toggleSwitch = document.createElement("label");
        toggleSwitch.className = "toggle";
        const inputCheckbox = document.createElement("input");
        inputCheckbox.type = "checkbox"; // Checkbox representing the toggle
        inputCheckbox.checked = true; // Alarm initially active

        const slider = document.createElement("span");
        slider.className = "slider round"; // Circular slider for the toggle
        toggleSwitch.appendChild(inputCheckbox);
        toggleSwitch.appendChild(slider);

        li.appendChild(toggleSwitch); // Add the toggle to the alarm list item
        alarmList.appendChild(li); // Add the alarm to the list

        // Display the time until the next alarm
        const timeUntilNextAlarm = calculateTimeUntilNextAlarm(alarmTime, repeatDays);
        const hoursUntilNextAlarm = Math.floor(timeUntilNextAlarm / (1000 * 60 * 60));
        const minutesUntilNextAlarm = Math.floor((timeUntilNextAlarm / (1000 * 60)) % 60);
        document.getElementById("next-alarm-info").textContent = 
            `Next alarm in: ${hoursUntilNextAlarm} hours and ${minutesUntilNextAlarm} minutes`;

        // Manage the alarm timeout
        let alarmTimeout = setTimeout(() => {
            if (inputCheckbox.checked) {
                playAlarm(alarmTone); // Play alarm if toggled on
            }
        }, timeUntilNextAlarm);

        // Handle toggle switch changes
        inputCheckbox.addEventListener("change", () => {
            if (!inputCheckbox.checked) {
                clearTimeout(alarmTimeout); // Cancel the timeout if toggled off
            } else {
                alarmTimeout = setTimeout(() => {
                    playAlarm(alarmTone); // Trigger alarm if toggled on again
                }, calculateTimeUntilNextAlarm(alarmTime, repeatDays));
            }
        });
    }
});

// Stopwatch Functionality
let stopwatchInterval = null;
let stopwatchSeconds = 0;

// Function to format time for display
function formatStopwatchTime(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
}

// Start the stopwatch
document.getElementById("start-stopwatch").addEventListener("click", () => {
    if (stopwatchInterval) return; // If it's already running, do nothing
    stopwatchInterval = setInterval(() => {
        stopwatchSeconds++;
        document.getElementById("stopwatch-display").textContent = formatStopwatchTime(stopwatchSeconds);
    }, 1000); // Increment every second
});

// Stop the stopwatch
document.getElementById("stop-stopwatch").addEventListener("click", () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null; // Stop the interval
});

// Reset the stopwatch
document.getElementById("reset-stopwatch").addEventListener("click", () => {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
    stopwatchSeconds = 0;
    document.getElementById("stopwatch-display").textContent = "00:00:00"; // Reset display
});

// Timer Functionality
let timerInterval = null;
let timerSecondsRemaining = 0;

// Function to format time for display
function formatTimerTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
}

// Start the timer
document.getElementById("start-timer").addEventListener("click", () => {
    if (timerInterval) return; // If it's already running, do nothing
    const timerMinutes = parseInt(document.getElementById("timer-minutes").value, 10) || 0;
    const timerSeconds = parseInt(document.getElementById("timer-seconds").value, 10) || 0;
    timerSecondsRemaining = (timerMinutes * 60) + timerSeconds;

    if (timerSecondsRemaining > 0) {
        timerInterval = setInterval(() => {
            if (timerSecondsRemaining > 0) {
                timerSecondsRemaining--;
                document.getElementById("timer-display").textContent = formatTimerTime(timerSecondsRemaining);
            } else {
                clearInterval(timerInterval); // Stop when timer reaches zero
                timerInterval = null;
                document.getElementById("timer-display").textContent = "00:00"; // Reset display
                alert("Timer is done!");
            }
        }, 1000); // Decrement every second
    }
});

// Stop the timer
document.getElementById("stop-timer").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null; // Stop the interval
});

// Reset the timer
document.getElementById("reset-timer").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById("timer-display").textContent = "00:00"; // Reset display
});
