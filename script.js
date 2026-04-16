function formatTime(date, timeZone) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZone,
    timeZoneName: "short"
  }).format(date);
}

function updateClocks() {
  const now = new Date();
  const visitor = document.getElementById("visitor-time");
  const cedric = document.getElementById("cedric-time");

  if (visitor) {
    visitor.textContent = formatTime(now, Intl.DateTimeFormat().resolvedOptions().timeZone);
  }

  if (cedric) {
    cedric.textContent = formatTime(now, "America/Los_Angeles");
  }
}

updateClocks();
setInterval(updateClocks, 1000);