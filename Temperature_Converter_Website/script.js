let selectedUnit = "C";

function selectUnit(unit) {
  selectedUnit = unit;
  document
    .querySelectorAll(".unit-btn")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelector(`.unit-btn[data-unit="${unit}"]`)
    .classList.add("active");
  const badges = { C: "°C", F: "°F", K: "K" };
  document.getElementById("inputBadge").textContent = badges[unit];
  clearError();

  const colors = {
    C: ["rgba(94,184,255,0.18)", "rgba(94,184,255,0.10)"],
    F: ["rgba(255,107,53,0.18)", "rgba(255,107,53,0.10)"],
    K: ["rgba(192,132,252,0.18)", "rgba(192,132,252,0.10)"],
  };
  document.getElementById("orb1").style.background = colors[unit][0];
  document.getElementById("orb2").style.background = colors[unit][1];
}

function convert() {
  const raw = document.getElementById("tempInput").value.trim();

  if (raw === "" || isNaN(Number(raw))) {
    showError("Please enter a valid number.");
    return;
  }

  const val = parseFloat(raw);

  // Validate Kelvin cannot be negative
  if (selectedUnit === "K" && val < 0) {
    showError("Kelvin cannot be negative.");
    return;
  }

  // Convert everything to Celsius first
  let celsius;
  if (selectedUnit === "C") celsius = val;
  else if (selectedUnit === "F") celsius = ((val - 32) * 5) / 9;
  else celsius = val - 273.15;

  // Validate absolute zero
  if (celsius < -273.15) {
    showError("Below absolute zero (−273.15 °C).");
    return;
  }

  const results = [
    { unit: "C", label: "Celsius", symbol: "°C", value: celsius },
    {
      unit: "F",
      label: "Fahrenheit",
      symbol: "°F",
      value: (celsius * 9) / 5 + 32,
    },
    { unit: "K", label: "Kelvin", symbol: "K", value: celsius + 273.15 },
  ].filter((r) => r.unit !== selectedUnit);

  renderResults(results);
}

function renderResults(results) {
  const area = document.getElementById("resultArea");
  const content = document.getElementById("resultContent");
  area.classList.add("has-result");

  content.innerHTML = '<div class="result-rows" id="resultRows"></div>';
  const rows = document.getElementById("resultRows");

  results.forEach((r, i) => {
    const row = document.createElement("div");
    row.className = "result-row";
    row.setAttribute("data-unit", r.unit);
    row.innerHTML = `
        <span class="result-value">${fmt(r.value)}</span>
        <span class="result-unit">${r.symbol} &mdash; ${r.label}</span>
      `;
    if (i < results.length - 1) {
      const sep = document.createElement("hr");
      sep.className = "separator";
      rows.appendChild(row);
      rows.appendChild(sep);
    } else {
      rows.appendChild(row);
    }
    // Staggered animation
    setTimeout(() => row.classList.add("visible"), 60 * i);
  });
}

function fmt(val) {
  // Round to 4 sig figs, strip trailing zeros
  const rounded = parseFloat(val.toPrecision(6));
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toString();
}

function showError(msg) {
  document.getElementById("errorMsg").textContent = msg;
  document.getElementById("tempInput").classList.add("error");
}

function clearError() {
  document.getElementById("errorMsg").textContent = "";
  document.getElementById("tempInput").classList.remove("error");
}

function handleKey(e) {
  if (e.key === "Enter") convert();
}
