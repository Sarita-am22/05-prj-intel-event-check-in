// Get the elements we need from the page
const checkInForm = document.getElementById("checkInForm");
const attendeeName = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const attendeeCount = document.getElementById("attendeeCount");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");

const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

const waterAttendeeList = document.getElementById("waterAttendeeList");
const zeroAttendeeList = document.getElementById("zeroAttendeeList");
const powerAttendeeList = document.getElementById("powerAttendeeList");

// Attendance goal
const attendanceGoal = 50;

// Load saved progress
const savedData = JSON.parse(localStorage.getItem("intelAttendance"));

// Keep track of attendance
let totalAttendees = savedData ? savedData.totalAttendees : 0;
let waterTeam = savedData ? savedData.waterTeam : 0;
let zeroTeam = savedData ? savedData.zeroTeam : 0;
let powerTeam = savedData ? savedData.powerTeam : 0;

// Keep track of attendee names and teams
let attendees = savedData ? savedData.attendees || [] : [];

// Show saved numbers
attendeeCount.textContent = totalAttendees;
waterCount.textContent = waterTeam;
zeroCount.textContent = zeroTeam;
powerCount.textContent = powerTeam;

// Show saved progress
const savedProgress = (totalAttendees / attendanceGoal) * 100;
progressBar.style.width = `${Math.min(savedProgress, 100)}%`;

// Function to display attendees by team
function displayAttendees() {
  waterAttendeeList.innerHTML = "";
  zeroAttendeeList.innerHTML = "";
  powerAttendeeList.innerHTML = "";

  attendees.forEach(function (attendee) {
    const listItem = document.createElement("li");
    listItem.textContent = attendee.name;

    if (attendee.team === "water") {
      waterAttendeeList.appendChild(listItem);
    } else if (attendee.team === "zero") {
      zeroAttendeeList.appendChild(listItem);
    } else if (attendee.team === "power") {
      powerAttendeeList.appendChild(listItem);
    }
  });
}

// Display saved attendees when page loads
displayAttendees();

// Run when someone checks in
checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get the attendee's name and team
  const name = attendeeName.value.trim();
  const team = teamSelect.value;

  // Add one person to the total
  totalAttendees++;

  // Add one person to the selected team
  if (team === "water") {
    waterTeam++;
  } else if (team === "zero") {
    zeroTeam++;
  } else if (team === "power") {
    powerTeam++;
  }

  // Update the numbers
  attendeeCount.textContent = totalAttendees;
  waterCount.textContent = waterTeam;
  zeroCount.textContent = zeroTeam;
  powerCount.textContent = powerTeam;

  // Update progress bar
  const progress = (totalAttendees / attendanceGoal) * 100;
  progressBar.style.width = `${Math.min(progress, 100)}%`;

  // Display greeting
  greeting.textContent = `Welcome, ${name}! Thanks for checking in.`;

  // Add attendee to the saved list
  attendees.push({
    name: name,
    team: team,
  });

  // Update the team lists
  displayAttendees();

  // Celebration when goal is reached
  if (totalAttendees === attendanceGoal) {
    let winningTeam = "Team Water Wise";
    let winningCount = waterTeam;

    if (zeroTeam > winningCount) {
      winningTeam = "Team Net Zero";
      winningCount = zeroTeam;
    }

    if (powerTeam > winningCount) {
      winningTeam = "Team Renewables";
      winningCount = powerTeam;
    }

    greeting.textContent =
      `🎉 We reached our goal of 50 attendees! ` +
      `${winningTeam} is leading with ${winningCount} attendees! 🎉`;
  }

  // Save everything
  localStorage.setItem(
    "intelAttendance",
    JSON.stringify({
      totalAttendees: totalAttendees,
      waterTeam: waterTeam,
      zeroTeam: zeroTeam,
      powerTeam: powerTeam,
      attendees: attendees,
    }),
  );

  // Clear the form
  attendeeName.value = "";
  teamSelect.value = "";
});
