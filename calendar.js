// Utility functions
function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

function renderCalendar(year, month) {
    const calendarGrid = document.getElementById("calendar-grid");
    const monthYear = document.getElementById("month-year");

    // Clear previous calendar content
    calendarGrid.innerHTML = "";

    // Render day names
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    dayNames.forEach(dayName => {
        const dayNameElement = document.createElement("div");
        dayNameElement.className = "day-name";
        dayNameElement.textContent = dayName;
        calendarGrid.appendChild(dayNameElement);
    });

    // Calculate empty spaces for offset
    const firstDay = firstDayOfMonth(year, month);
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "day empty";
        calendarGrid.appendChild(emptyDay);
    }

    // Render days of the current month
    const totalDays = daysInMonth(year, month);
    for (let i = 1; i <= totalDays; i++) {
        const dayElement = document.createElement("div");
        dayElement.className = "day";
        dayElement.textContent = i.toString();
        calendarGrid.appendChild(dayElement);
    }

    // Update month-year text
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    monthYear.textContent = `${monthNames[month]} ${year}`;
}

// Current date
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// Render the initial calendar
renderCalendar(currentYear, currentMonth);

// Event listeners for previous and next month buttons
document.querySelector(".prev-month").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentYear, currentMonth);
});

document.querySelector(".next-month").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentYear, currentMonth);
});

// Event listener for "Go To" button
document.getElementById("go-to-button").addEventListener("click", () => {
    const goToMonth = parseInt(document.getElementById("go-to-month").value, 10) - 1; // 0-indexed
    const goToYear = parseInt(document.getElementById("go-to-year").value, 10);

    if (isNaN(goToMonth) || goToMonth < 0 || goToMonth > 11 || isNaN(goToYear) || goToYear < 1) {
        alert("Invalid month or year. Please enter valid numbers.");
        return;
    }

    currentMonth = goToMonth;
    currentYear = goToYear;
    renderCalendar(currentYear, currentMonth);
});
