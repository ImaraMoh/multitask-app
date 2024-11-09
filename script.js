document.addEventListener("DOMContentLoaded", function() {
    // Navigation to other pages
    document.getElementById("calculator-tab").addEventListener("click", function() {
        window.location.href = "Calculatorapp.html";
    });

    document.getElementById("calendar-tab").addEventListener("click", function() {
        window.location.href = "Calendar.html";
    });

    document.getElementById("clock-tab").addEventListener("click", function() {
        window.location.href = "Clock.html";
    });

    document.getElementById("remainder-tab").addEventListener("click", function() {
        window.location.href = "Remainder.html";
    });

    // Show the modal for game selection
    const gameBtn = document.getElementById("game-tab");
    const gameScreen = document.getElementById("gameScreen");
    const closeScreen = document.getElementById("close-modal");

    gameBtn.addEventListener("click", function() {
        gameScreen.classList.remove("hidden");
    });

    closeScreen.addEventListener("click", function() {
        gameScreen.classList.add("hidden");
    });

    // Game-specific navigation
    document.getElementById("Tictactoe").addEventListener("click", function() {
        window.location.href = "game.html";
    });

    document.getElementById("Snake").addEventListener("click", function() {
        window.location.href = "snake.html";
    });
});
