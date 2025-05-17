document.addEventListener("DOMContentLoaded", () => {
  let userGoal = localStorage.getItem("userGoal") || "weight-loss";
  userGoal = userGoal.replace("-", "_");

  const plans = {
    weight_loss: [
      { name: "Jumping Jacks", sets: "3 sets of 20", icon: "🤸", calories: 100 },
      { name: "Running", sets: "20 mins", icon: "🏃", calories: 200 },
      { name: "Burpees", sets: "3 sets of 10", icon: "🏋️", calories: 120 }
    ],
    muscle_gain: [
      { name: "Deadlifts", sets: "4 sets of 8", icon: "🏋️", calories: 180 },
      { name: "Push-ups", sets: "4 sets of 12", icon: "💪", calories: 90 },
      { name: "Squats", sets: "4 sets of 10", icon: "🦵", calories: 130 }
    ],
    endurance: [
      { name: "Jogging", sets: "30 mins", icon: "🏃‍♂️", calories: 200 },
      { name: "Cycling", sets: "20 mins", icon: "🚴", calories: 160 },
      { name: "Swimming", sets: "30 mins", icon: "🏊", calories: 220 }
    ],
    flexibility: [
      { name: "Yoga Poses", sets: "30 mins", icon: "🧘", calories: 100 },
      { name: "Stretching", sets: "3 sets of 10", icon: "🤸", calories: 60 },
      { name: "Side Bends", sets: "3 sets of 15", icon: "🧎", calories: 70 }
    ],
    strength: [
      { name: "Bench Press", sets: "4 sets of 6", icon: "🏋️‍♂️", calories: 150 },
      { name: "Barbell Rows", sets: "4 sets of 8", icon: "🏋️", calories: 140 },
      { name: "Lunges", sets: "3 sets of 12", icon: "🦵", calories: 110 }
    ]
  };

  const container = document.getElementById("workoutList");
const progressFill = document.querySelector(".progress-fill");
const progressText = document.getElementById("progressText");
const finishBtn = document.getElementById("finishWorkout");
const encouragementMsg = document.getElementById("motivation");

const today = new Date().toISOString().split("T")[0];
const workoutHistory = JSON.parse(localStorage.getItem("workoutHistory")) || [];

const alreadyDone = workoutHistory.some(entry =>
  entry.date === today && entry.goal === userGoal.replace("_", " ")
);

const exercises = plans[userGoal] || [];
let completedSet = new Set(JSON.parse(localStorage.getItem("completedSet")) || []);
let totalCalories = 0;

if (alreadyDone) {
  if (encouragementMsg) {
    encouragementMsg.textContent = "You’ve already completed today’s workout for this goal!";
    encouragementMsg.classList.remove("hidden");
  }
  if (container) {
    container.innerHTML = "<p class='done-message'>Come back tomorrow for a new challenge!</p>";
  }
  if (progressText) progressText.textContent = "100% complete";
  if (progressFill) progressFill.style.width = "100%";
  if (finishBtn) finishBtn.disabled = true;
  return; // Stop script from continuing
}

if (container) {
  exercises.forEach((exercise) => {
    const card = document.createElement("div");
    card.className = "exercise";

    const isCompleted = completedSet.has(exercise.name);
    if (isCompleted) {
      totalCalories += exercise.calories;
    }

    card.innerHTML = `
      <div class="exercise-icon">${exercise.icon}</div>
      <p>${exercise.name} – ${exercise.sets}</p>
      <button class="toggle-btn" ${isCompleted ? "disabled" : ""}>
        ${isCompleted ? "Done" : "Mark Done"}
      </button>
    `;

    const btn = card.querySelector("button");
    if (!isCompleted) {
      btn.addEventListener("click", () => markDone(btn, exercise.name, card, exercise.calories));
    } else {
      btn.classList.add("completed");
      card.classList.add("completed");
    }

    container.appendChild(card);
  });

  updateProgress();
}

function markDone(btn, name, card, calories) {
  if (completedSet.has(name)) return;

  completedSet.add(name);
  btn.textContent = "Done";
  btn.disabled = true;
  btn.classList.add("completed");
  card.classList.add("completed");

  localStorage.setItem("completedSet", JSON.stringify(Array.from(completedSet)));

  totalCalories += calories;
  updateProgress();
}

function updateProgress() {
  const done = completedSet.size;
  const total = exercises.length;
  const percent = Math.round((done / total) * 100);

  if (progressFill) progressFill.style.width = percent + "%";
  if (progressText) progressText.textContent = `${percent}% complete (${totalCalories} kcal)`;

  if (encouragementMsg) {
    encouragementMsg.textContent =
      done === total ? "Amazing job! You’ve finished today’s workout." : "Keep going! You're doing great.";
    encouragementMsg.classList.remove("hidden");
  }

  if (finishBtn) finishBtn.disabled = done !== total;
}

if (finishBtn) {
  finishBtn.addEventListener("click", () => {
    if (completedSet.size !== exercises.length) return;

    // Launch confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      const history = JSON.parse(localStorage.getItem("workoutHistory")) || [];

      const now = new Date();
      const date = now.toISOString().split("T")[0];

      const logEntry = {
        goal: userGoal.replace("_", " "),
        exercises: Array.from(completedSet),
        calories: totalCalories,
        date: date
      };

      history.push(logEntry);
      localStorage.setItem("workoutHistory", JSON.stringify(history));
      localStorage.setItem(
        "todayLog",
        `Goal: ${logEntry.goal}, Exercises: ${logEntry.exercises.length}, Calories: ${logEntry.calories}`
      );
      localStorage.removeItem("completedSet");

      alert("Workout complete! Redirecting to home...");
      window.location.href = "index.html";
    }, 2000);
  });
}

// Resume workout progress (for workout-plan.html)
if (window.location.pathname.includes("workout-plan")) {
  const userGoal = localStorage.getItem("userGoal");
  const savedProgress = JSON.parse(localStorage.getItem("incompleteWorkout")) || {};
  const userProgress = savedProgress[userGoal] || [];
  // Continue with your workout plan display logic...
}

// Prevent navigation if no goal selected
const navPlanBtn = document.getElementById("navPlan");
if (navPlanBtn) {
  navPlanBtn.addEventListener("click", (e) => {
    const goal = localStorage.getItem("userGoal");
    if (!goal) {
      e.preventDefault();
      alert("Please select a fitness goal before viewing your plan.");
    }
  });
}
});
