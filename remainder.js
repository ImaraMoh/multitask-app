const reminderForm = document.getElementById('reminderForm');
const reminderList = document.getElementById('reminderList');
const timers = new Map(); // Map to store timers with IDs for easy deletion

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("Back").addEventListener("click", function() {
        window.location.href = "index.html";
    });
});


reminderForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission

    const text = document.getElementById('reminderText').value;
    const time = new Date(document.getElementById('reminderTime').value);

    // Add reminder to list
    const li = document.createElement('li');
    li.innerText = `Reminder: ${text} - Time : ${time.toLocaleString()}   `;

    // Create a delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = () => {
        // Clear timer if it exists and remove the reminder
        const timerId = li.getAttribute('data-timer-id');
        if (timerId && timers.has(timerId)) {
            clearTimeout(timers.get(timerId));
            timers.delete(timerId);
        }

        reminderList.removeChild(li);
    };

    li.appendChild(deleteButton);
    reminderList.appendChild(li);

    // Set a timer for the reminder
    const now = new Date();
    const timeDiff = time - now; // Time difference in milliseconds

    if (timeDiff > 0) {
        const timerId = setTimeout(function () {
            alert(`Reminder: ${text}`);
        }, timeDiff);

        // Store timer ID in the list item for future reference
        li.setAttribute('data-timer-id', timerId.toString());
        timers.set(timerId.toString(), timerId);
    } else {
        alert("Please choose a future date/time.");
    }

    // Reset form fields
    document.getElementById('reminderText').value = '';
    document.getElementById('reminderTime').value = '';
});
