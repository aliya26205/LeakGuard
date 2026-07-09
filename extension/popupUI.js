// ======================================
// LeakGuard Popup UI
// ======================================

console.log("🛡️ Popup UI Loaded");

function showLeakGuardPopup(findings, originalText, inputBox) {

    // Prevent multiple popups
    const oldPopup = document.getElementById("leakguard-overlay");
    if (oldPopup) {
        oldPopup.remove();
    }

    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "leakguard-overlay";

    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.45)";
    overlay.style.backdropFilter = "blur(5px)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "999999999";

    // Popup card
    const popup = document.createElement("div");

    popup.style.width = "430px";
    popup.style.background = "#ffffff";
    popup.style.borderRadius = "16px";
    popup.style.padding = "25px";
    popup.style.fontFamily = "Segoe UI, Arial";
    popup.style.boxShadow = "0 15px 40px rgba(0,0,0,.25)";
    popup.style.animation = "popupFade .25s ease";

    let detected = "";

    findings.forEach(item => {
        detected += `
        <li style="margin:6px 0;">
            🔴 <b>${item.type}</b>
            <span style="color:#666;">(${item.risk})</span>
        </li>`;
    });

    popup.innerHTML = `
        <div style="text-align:center;">

            <div style="
                width:70px;
                height:70px;
                margin:auto;
                background:#ef4444;
                color:white;
                border-radius:50%;
                display:flex;
                justify-content:center;
                align-items:center;
                font-size:34px;
            ">
                ⚠
            </div>

            <h2 style="margin:15px 0 5px;">
                LeakGuard Warning
            </h2>

            <p style="color:#555;">
                Sensitive information detected in your prompt.
            </p>

        </div>

        <hr>

        <h3>Detected Data</h3>

        <ul style="padding-left:18px;">
            ${detected}
        </ul>

        <div style="
            background:#fff4e5;
            border-left:5px solid orange;
            padding:10px;
            margin-top:15px;
            border-radius:6px;
        ">
            Risk Level :
            <b style="color:red;">HIGH</b>
        </div>

        <div style="
            display:flex;
            gap:10px;
            margin-top:20px;
        ">

            <button id="lg-continue"
            style="
                flex:1;
                padding:10px;
                border:none;
                background:#16a34a;
                color:white;
                border-radius:8px;
                cursor:pointer;
            ">
                Continue
            </button>

            <button id="lg-sanitize"
            style="
                flex:1;
                padding:10px;
                border:none;
                background:#2563eb;
                color:white;
                border-radius:8px;
                cursor:pointer;
            ">
                Sanitize
            </button>

            <button id="lg-cancel"
            style="
                flex:1;
                padding:10px;
                border:none;
                background:#dc2626;
                color:white;
                border-radius:8px;
                cursor:pointer;
            ">
                Cancel
            </button>

        </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Continue
    document.getElementById("lg-continue").onclick = () => {

        console.log("✅ User selected Continue");

        overlay.remove();

    };

    // Cancel
    document.getElementById("lg-cancel").onclick = () => {

        console.log("❌ User cancelled");

        inputBox.innerText = "";

        overlay.remove();

    };

    // Sanitize
    document.getElementById("lg-sanitize").onclick = () => {

        console.log("🧹 Sanitizing prompt...");

        const sanitized = Sanitizer.mask(originalText);

        inputBox.innerText = sanitized;

        overlay.remove();

    };

}