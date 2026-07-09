// ======================================
// LeakGuard Popup UI
// ======================================

console.log("🛡️ Popup UI Loaded");

function showLeakGuardPopup(findings, originalText, inputBox) {
  const old = document.getElementById("leakguard-overlay");
  if (old) old.remove();

  // Highest risk
  let highestRisk = "Low";

  findings.forEach((f) => {
    if (f.risk === "Critical") highestRisk = "Critical";
    else if (f.risk === "High" && highestRisk !== "Critical")
      highestRisk = "High";
    else if (
      f.risk === "Medium" &&
      highestRisk !== "Critical" &&
      highestRisk !== "High"
    )
      highestRisk = "Medium";
  });

  let riskColor = "#16a34a";

  if (highestRisk === "Medium") riskColor = "#f59e0b";

  if (highestRisk === "High") riskColor = "#ef4444";

  if (highestRisk === "Critical") riskColor = "#7f1d1d";

  //-------------------------------------------------------

  const overlay = document.createElement("div");

  overlay.id = "leakguard-overlay";

  overlay.style.position = "fixed";
  overlay.style.left = "0";
  overlay.style.top = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,.45)";
  overlay.style.backdropFilter = "blur(4px)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "99999999";

  //-------------------------------------------------------

  const popup = document.createElement("div");

  popup.style.width = "520px";
  popup.style.background = "#ffffff";
  popup.style.borderRadius = "18px";
  popup.style.padding = "28px";
  popup.style.fontFamily = "Segoe UI";
  popup.style.boxShadow = "0 20px 45px rgba(0,0,0,.35)";
  popup.style.color = "#111827";

  //-------------------------------------------------------

  let detectedHTML = "";

  findings.forEach((item) => {
    detectedHTML += `

        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-top:10px;
            padding:10px;
            background:#f8fafc;
            border-radius:8px;
        ">

            <span style="
                color:#111827;
                font-weight:600;
            ">
                ${item.type}
            </span>

            <span style="
                color:${riskColor};
                font-weight:bold;
            ">
                ${item.risk}
            </span>

        </div>

        `;
  });

  popup.innerHTML = `

        <div style="text-align:center;">

            <div style="
                width:85px;
                height:85px;
                margin:auto;
                border-radius:50%;
                background:#ef4444;
                display:flex;
                justify-content:center;
                align-items:center;
                font-size:40px;
                color:white;
            ">
                ⚠
            </div>

            <h1 style="
                margin-top:20px;
                margin-bottom:10px;
                color:#111827;
                font-size:28px;
            ">
                LeakGuard Warning
            </h1>

            <p style="
                color:#4b5563;
                font-size:17px;
                margin-bottom:20px;
            ">
                Sensitive information detected in your prompt.
            </p>

        </div>

        <hr>

        <h2 style="
            color:#111827;
            margin-top:18px;
        ">
            Detected Data
        </h2>

        ${detectedHTML}

        <div style="
            margin-top:22px;
            padding:14px;
            border-radius:10px;
            background:#fff7ed;
            border-left:6px solid ${riskColor};
            color:#111827;
            font-size:18px;
        ">

            Risk Level :
            <span style="
                color:${riskColor};
                font-weight:bold;
            ">
                ${highestRisk}
            </span>

        </div>

        <div style="
            display:flex;
            gap:12px;
            margin-top:28px;
        ">

            <button id="lg-continue"
            style="
                flex:1;
                border:none;
                padding:12px;
                border-radius:8px;
                background:#16a34a;
                color:white;
                font-size:16px;
                cursor:pointer;
            ">
                Continue
            </button>

            <button id="lg-sanitize"
            style="
                flex:1;
                border:none;
                padding:12px;
                border-radius:8px;
                background:#2563eb;
                color:white;
                font-size:16px;
                cursor:pointer;
            ">
                Sanitize
            </button>

            <button id="lg-cancel"
            style="
                flex:1;
                border:none;
                padding:12px;
                border-radius:8px;
                background:#dc2626;
                color:white;
                font-size:16px;
                cursor:pointer;
            ">
                Cancel
            </button>

        </div>

    `;

  overlay.appendChild(popup);

  document.body.appendChild(overlay);

  //-------------------------------------------------------

  document.getElementById("lg-continue").onclick = () => {
    sendLog("Continue", findings);

    overlay.remove();

    closeLeakGuardPopup();
  };

  //-------------------------------------------------------

  document.getElementById("lg-cancel").onclick = () => {

    sendLog("Cancelled", findings);

    inputBox.innerText = "";

    overlay.remove();

    closeLeakGuardPopup();

};
  //-------------------------------------------------------

  document.getElementById("lg-sanitize").onclick = () => {

    sendLog("Sanitized", findings);

    inputBox.innerText = Sanitizer.mask(originalText);

    overlay.remove();

    closeLeakGuardPopup();

};
}
// ======================================
// Send Log to Backend
// ======================================

async function sendLog(action, findings) {
  chrome.storage.local.get(["employee"], async ({ employee }) => {
    if (!employee) return;

    const payload = {
      employee_id: employee.id,

      ai_tool: window.location.hostname,

      detected_items: findings.map((item) => item.type),

      severity: findings[0].risk,

      action_taken: action,

      website_url: window.location.href,

      status: "Completed",
    };

    try {
      await fetch("http://localhost:5000/api/log", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      console.log("✅ Log Sent");
    } catch (err) {
      console.log("Backend Error");

      console.log(err);
    }
  });
}
