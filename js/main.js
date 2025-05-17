document.addEventListener("DOMContentLoaded", () => {
  // Hamburger toggle
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("show");
    });
  }

  // Dark mode toggle
  const toggle = document.getElementById("darkModeToggle");
  const body = document.body;
  if (toggle) {
    if (localStorage.getItem("darkMode") === "enabled") {
      body.classList.add("dark-mode");
      toggle.checked = true;
    }

    toggle.addEventListener("change", () => {
      if (toggle.checked) {
        body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "enabled");
      } else {
        body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "disabled");
      }
    });
  }

  // Handle goal selection (index.html)
  function handleGoalSubmit(e) {
    e.preventDefault();
    const nickname = document.getElementById("nickname").value.trim();
    const goal = document.getElementById("goal").value;

    if (!nickname) {
      alert("Please enter your nickname.");
      return;
    }
    if (!goal) {
      alert("Please select a fitness goal before proceeding.");
      return;
    }

    localStorage.setItem("userNickname", nickname);
    localStorage.setItem("userGoal", goal);
    window.location.href = "confirmation.html";
  }

  const userForm = document.getElementById("user-form");
  if (userForm) {
    userForm.addEventListener("submit", handleGoalSubmit);
  }

  // Confirmation page loader
  if (document.getElementById("confirmationPage")) {
    const container = document.querySelector(".container");
    const nickname = localStorage.getItem("userNickname") || "Athlete";
    const goal = localStorage.getItem("userGoal") || "Not selected";

    container.innerHTML = `<h1 class="loading-msg">Loading your personalized plan...</h1><div class="loader"></div>`;
    setTimeout(() => {
      container.innerHTML = `
        <div class="reveal">
          <h1>Welcome, <span class="highlight">${nickname}</span>!</h1>
          <h2>Your Personalized Plan is Ready!</h2>
          <p>Your fitness goal is: <strong>${goal.replace(
            "-",
            " "
          )}</strong></p>
          <button class="confirm-btn" onclick="goToPlan()">Go to My Plan</button>
          <p class="quote">Stay consistent, and results will follow.</p>
          <div class="illustration">
            <img src="./assets/images/png/weightlifting.png" alt="weightlifting icon" class="img" />
          </div>
        </div>
      `;
    }, 1500);
  }

  window.goToPlan = function () {
    window.location.href = "workout-plan.html";
  };

  // Display today's log on index.html
  const todayLogEl = document.getElementById("todayLog");
  if (todayLogEl) {
    const todayLog =
      localStorage.getItem("todayLog") || "No workout logged yet.";
    todayLogEl.textContent = todayLog;
  }

  // Display history list
  const historyList = document.getElementById("historyList");
  if (historyList) {
    const history = JSON.parse(localStorage.getItem("workoutHistory")) || [];
    if (history.length === 0) {
      historyList.innerHTML = "<li>No history yet.</li>";
    } else {
      // Show most recent first
      history
        .slice()
        .reverse()
        .forEach((entry) => {
          const li = document.createElement("li");
          li.innerHTML = `
          <strong>Goal:</strong> ${entry.goal}<br>
          <strong>Exercises:</strong> ${entry.exercises.join(", ")}<br>
          <strong>Date:</strong> ${entry.date}
        `;
          historyList.appendChild(li);
        });
    }
  }

// --- Calendar with Prev/Next navigation and animations (index.html) ---
const calendarHeader = document.getElementById("calendarHeader");
const calendarBody = document.getElementById("calendarBody");
if (calendarHeader && calendarBody) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Track current year and month to navigate calendar
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth();

  function formatDateISO(y, m, d) {
    const mm = (m + 1).toString().padStart(2, "0");
    const dd = d.toString().padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  }

  function renderCalendar(year, month) {
    calendarHeader.innerHTML = `
      <button id="prevMonthBtn" aria-label="Previous Month">&lt;</button>
      <span>${monthNames[month]} ${year}</span>
      <button id="nextMonthBtn" aria-label="Next Month">&gt;</button>
    `;

    // Add a fade-out animation before rebuilding the calendar
    calendarBody.style.opacity = 0;

    setTimeout(() => {
      calendarBody.innerHTML = ""; // Clear previous

      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const workoutArray = JSON.parse(localStorage.getItem("workoutHistory")) || [];
      const workoutHistory = {};
      workoutArray.forEach(entry => {
        workoutHistory[entry.date] = entry;
      });

      let row = document.createElement("tr");

      // Fill empty cells before first day
      for (let i = 0; i < firstDay; i++) {
        row.appendChild(document.createElement("td"));
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = formatDateISO(year, month, day);
        const cell = document.createElement("td");
        cell.textContent = day;

        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
          cell.classList.add("today");
        }

        if (workoutHistory[dateStr]) {
          cell.classList.add("completed");
          const label = document.createElement("div");
          label.className = "goal-label";
          label.textContent = workoutHistory[dateStr].goal;
          cell.appendChild(label);
        }

        cell.addEventListener("click", () => {
          if (!workoutHistory[dateStr]) {
            alert("No workout logged on this day.");
            return;
          }
          showWorkoutPopup(dateStr, workoutHistory[dateStr]);
        });

        row.appendChild(cell);

        if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
          calendarBody.appendChild(row);
          row = document.createElement("tr");
        }
      }

      // Fade-in animation after content update
      calendarBody.style.opacity = 1;

      // Add listeners to prev/next buttons
      const prevBtn = document.getElementById("prevMonthBtn");
      const nextBtn = document.getElementById("nextMonthBtn");

      prevBtn.addEventListener("click", () => {
        if (currentMonth === 0) {
          currentMonth = 11;
          currentYear--;
        } else {
          currentMonth--;
        }
        renderCalendar(currentYear, currentMonth);
      });

      nextBtn.addEventListener("click", () => {
        if (currentMonth === 11) {
          currentMonth = 0;
          currentYear++;
        } else {
          currentMonth++;
        }
        renderCalendar(currentYear, currentMonth);
      });

    }, 300); // 300ms fade-out duration, adjust as you like
  }

  // Initial render
  renderCalendar(currentYear, currentMonth);
}

  // Close popup when button is clicked
  const closeBtn = document.getElementById("closePopup");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.getElementById("calendarPopup").classList.add("hidden");
    });
  }

  // Show popup with workout details
  window.showWorkoutPopup = function (date, data) {
    document.getElementById("popupDate").textContent = `Workout on ${date}`;
    document.getElementById("popupGoal").textContent = `Goal: ${data.goal}`;

    const list = document.getElementById("popupExercises");
    list.innerHTML = "";

    const exercisesLabel = document.createElement("li");
    exercisesLabel.textContent = "Exercises:";
    exercisesLabel.style.fontWeight = "bold";
    list.appendChild(exercisesLabel);

    data.exercises.forEach((ex) => {
      const li = document.createElement("li");
      li.textContent = `- ${ex}`;
      list.appendChild(li);
    });

    document.getElementById("calendarPopup").classList.remove("hidden");
  };
});
