(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const pages = {
    overview: ["Investigation overview", "Explore a simulated vehicle incident and its sensor evidence."],
    reconstruction: ["Accident reconstruction", "Adjust scenario assumptions and explore a conceptual event."],
    telemetry: ["Sensor telemetry", "Inspect synchronized, synthetic vehicle sensor channels."],
    events: ["Event timeline", "Review event markers relative to the hypothetical incident."],
    reports: ["Reports & findings", "Prepare an illustrative case summary for review."]
  };
  function goto(page) {
    document.querySelectorAll(".page").forEach(el => el.classList.toggle("active", el.id === page));
    document.querySelectorAll(".nav").forEach(el => el.classList.toggle("active", el.dataset.page === page));
    $("page-title").textContent = pages[page][0];
    $("page-subtitle").textContent = pages[page][1];
    window.scrollTo({top: 0, behavior: "smooth"});
  }
  document.querySelectorAll("[data-page]").forEach(btn => btn.addEventListener("click", () => goto(btn.dataset.page)));
  document.querySelectorAll("[data-goto]").forEach(btn => btn.addEventListener("click", () => goto(btn.dataset.goto)));

  function signal(t) { return 0.08 * Math.sin(t * 0.7) + 0.11 * Math.sin(t * 2.2) + (Math.abs(t - 50) < 5 ? (1 - Math.abs(t - 50) / 5) * 4.6 : 0); }
  function drawChart() {
    const points = [];
    for (let i = 0; i <= 100; i++) points.push(`${(35 + i * 6.3).toFixed(1)},${(75 - signal(i) * 14).toFixed(1)}`);
    let grid = "";
    for (let y = 25; y <= 125; y += 25) grid += `<line x1="35" y1="${y}" x2="665" y2="${y}" stroke="#27364a"/><text x="27" y="${y + 3}" text-anchor="end" fill="#8296ae" font-size="9">${((75-y)/14).toFixed(1)}</text>`;
    $("chart").innerHTML = grid + `<line x1="350" y1="20" x2="350" y2="130" stroke="#f59e62" stroke-dasharray="4 4"/><polyline points="${points.join(" ")}" fill="none" stroke="#43dfca" stroke-width="2"/>`;
  }
  let playback = null;
  function stop() { if (playback) { clearInterval(playback); playback = null; } }
  function updateTime() {
    const v = +$("timeline").value;
    const t = -5 + v / 10;
    $("clock").textContent = `${t > 0 ? "+" : ""}${t.toFixed(1)} s`;
    const speed = Math.max(0, Math.round(48 + (35 - v) * 0.9));
    $("speedmetric").innerHTML = `${speed} <small>km/h</small>`;
    $("ts").innerHTML = `${speed} <small>km/h</small>`;
    $("tx").textContent = `${(signal(v) - 0.15).toFixed(2)} g`;
    $("tz").innerHTML = `${(Math.sin(v / 9) * 21).toFixed(1)} <small>°/s</small>`;
    $("vehicle-marker").setAttribute("transform", `translate(${Math.max(35, Math.min(535, 170 + v * 2.7))} ${142 + Math.sin(v / 12) * 12}) rotate(${Math.max(-20, Math.min(40, v - 30))})`);
    $("peak").innerHTML = `${v > 43 && v < 57 ? (1 + 4 * Math.max(0, 1 - Math.abs(v - 50) / 7)).toFixed(1) : "0.2"} <small>g</small>`;
  }
  $("timeline").addEventListener("input", updateTime);
  $("play").addEventListener("click", () => {
    stop();
    playback = setInterval(() => {
      const v = +$("timeline").value;
      if (v >= 100) { stop(); return; }
      $("timeline").value = v + 1;
      updateTime();
    }, 150);
  });
  $("pause").addEventListener("click", stop);

  $("initial-speed").addEventListener("input", () => $("initial-out").textContent = `${$("initial-speed").value} km/h`);
  $("brake-time").addEventListener("input", () => $("brake-out").textContent = `${$("brake-time").value} sec`);
  $("simulate").addEventListener("click", () => {
    const speed = +$("initial-speed").value, surface = $("surface").value, scenario = $("scenario").value, brake = +$("brake-time").value;
    const friction = {dry: 0.75, wet: 0.45, loose: 0.35}[surface];
    const distance = speed * speed / (254 * friction);
    const names = {brake: "Sudden braking", impact: "Hypothetical collision", swerve: "Sudden steering manoeuvre"};
    $("sim-heading").textContent = "Scenario preview updated";
    $("sim-text").textContent = scenario === "brake"
      ? `At ${speed} km/h, a simplified idealized braking-distance estimate is about ${distance.toFixed(1)} m, excluding reaction distance, grade, tyre condition and real-world variation. Braking onset is set to ${brake} seconds before the event.`
      : scenario === "impact"
        ? `A collision scenario has been selected at ${speed} km/h. This preview does not compute impact forces, deformation, injury risk or validated collision dynamics.`
        : `A steering manoeuvre has been selected at ${speed} km/h. Path stability and rollover outcomes are not calculated by this conceptual preview.`;
    $("sim-speed").textContent = `${speed} km/h`;
    $("sim-surface").textContent = {dry: "Dry", wet: "Wet", loose: "Loose gravel"}[surface];
    $("sim-type").textContent = names[scenario];
  });

  const channels = [
    ["Accelerometer X", "−0.20 g", "Signal changes around the event marker"],
    ["Accelerometer Y", "0.13 g", "Lateral movement component"],
    ["Accelerometer Z", "1.02 g", "Vertical axis including gravity"],
    ["Gyroscope X", "2.4 °/s", "Roll rotation"], ["Gyroscope Y", "−1.6 °/s", "Pitch rotation"],
    ["Gyroscope Z", "4.1 °/s", "Yaw rotation"], ["GPS latitude", "17.3850°", "Synthetic coordinate"],
    ["GPS longitude", "78.4867°", "Synthetic coordinate"], ["GPS speed", "48 km/h", "Illustrative velocity"]
  ];
  function renderTelemetry() {
    $("telemetry-lines").innerHTML = channels.map(c => `<div class="telemetry-row"><div><div>${c[0]}</div><p>${c[2]}</p></div><strong>${c[1]}</strong></div>`).join("");
  }
  $("refresh").addEventListener("click", () => {
    updateTime();
    $("refresh").textContent = "✓ Sample refreshed";
    setTimeout(() => $("refresh").textContent = "↻ Update sample", 1000);
  });
  const events = [
    ["−5.0 s", "Baseline window begins", "Initial motion and orientation data"],
    ["−1.5 s", "Braking onset (scenario input)", "Configurable hypothetical event"],
    ["−0.4 s", "Deceleration change", "Candidate event to verify against source data"],
    ["0.0 s", "Reference event marker", "Time origin for relative event analysis"],
    ["+0.5 s", "Post-event sensor window", "Inspect changes in acceleration and rotation"],
    ["+2.0 s", "Follow-up window", "Compare GPS speed and orientation"]
  ];
  $("eventlist").innerHTML = events.map((e, i) => `<div class="event-row"><div class="event-time" style="${i === 3 ? "color:#f6b77e" : ""}">${e[0]}</div><div><strong>${e[1]}</strong><p>${e[2]}</p></div></div>`).join("");

  function reportText() {
    return `ACCI-DECODE — DEMO INCIDENT SUMMARY
Case: ACD-2026-0042
Status: Illustrative draft

All values below are synthetic and not forensic evidence.
Selected timestamp: ${$("clock").textContent}
Selected vehicle speed: ${$("speedmetric").textContent.trim().replace(/\s+/g, " ")}
Scenario speed: ${$("initial-speed").value} km/h
Surface: ${$("surface").value}
Scenario: ${$("scenario").value}

Required validation: source-data provenance, sensor calibration, clock synchronization, GPS uncertainty, and investigator review.

This conceptual demo does not establish accident causation or determine fault.
`;
  }
  $("export-report").addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([reportText()], {type: "text/plain;charset=utf-8"}));
    const a = document.createElement("a");
    a.href = url; a.download = "acci-decode-demo-summary.txt"; a.click();
    URL.revokeObjectURL(url);
    $("export-note").textContent = "Demo summary downloaded.";
  });
  $("print-report").addEventListener("click", () => {
    const w = window.open("", "_blank");
    if (!w) { $("export-note").textContent = "Pop-up blocked. Use Export demo summary instead."; return; }
    w.document.write("<!doctype html><html><head><title>Acci-Decode Demo Summary</title><style>body{font:14px system-ui;max-width:760px;margin:50px auto;white-space:pre-wrap;line-height:1.7}</style></head><body></body></html>");
    w.document.body.textContent = reportText(); w.document.close(); w.print();
  });
  $("reset").addEventListener("click", () => {
    stop(); $("timeline").value = 35; $("initial-speed").value = 60; $("brake-time").value = 1.5;
    $("surface").value = "dry"; $("scenario").value = "brake";
    $("initial-out").textContent = "60 km/h"; $("brake-out").textContent = "1.5 sec";
    $("sim-heading").textContent = "Ready to explore";
    $("sim-text").textContent = "Set your inputs and run a scenario to display a conceptual result.";
    goto("overview"); updateTime();
  });
  drawChart(); renderTelemetry(); updateTime();
})();
