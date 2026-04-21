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

async function setupProofModal() {
  const modal = document.getElementById("proof-modal");
  if (!modal) return;

  const proofButtons = document.querySelectorAll("[data-proof-key]");
  if (!proofButtons.length) return;

  let proofData = {};

  try {
    const response = await fetch("/assets/proof.json", { cache: "no-store" });
    proofData = await response.json();
  } catch (error) {
    console.error("Failed to load proof data:", error);
    return;
  }

  const titleEl = document.getElementById("proof-modal-title");
  const statusEl = document.getElementById("proof-modal-status");
  const summaryEl = document.getElementById("proof-modal-summary");
  const valueEl = document.getElementById("proof-modal-value");
  const linkEl = document.getElementById("proof-modal-link");

  function openModal(proof) {
    titleEl.textContent = proof.label || "Proof Details";
    statusEl.textContent = proof.status || "Available";
    summaryEl.textContent = proof.summary || "";
    valueEl.textContent = proof.value || "—";

    if (proof.source_url) {
      linkEl.href = proof.source_url;
      linkEl.hidden = false;
    } else {
      linkEl.hidden = true;
    }

    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  proofButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.getAttribute("data-proof-key");
      const proof = proofData[key];
      if (!proof) return;
      openModal(proof);
    });
  });

  modal.querySelectorAll("[data-proof-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
}

updateClocks();
setInterval(updateClocks, 1000);
setupProofModal();