// ======================================
// LeakGuard Content Script
// ======================================

console.log("🛡️ LeakGuard Content Script Loaded");

let popupOpen = false;

window.addEventListener("load", () => {
    initializeLeakGuard();
});

function initializeLeakGuard() {

    console.log("🔍 LeakGuard Monitoring Started");

    const observer = new MutationObserver(() => {

        const inputBox = document.querySelector('[contenteditable="true"]');

        if (!inputBox) return;

        if (inputBox.dataset.leakguardAttached) return;

        inputBox.dataset.leakguardAttached = "true";

        console.log("✅ Prompt Box Detected");

        // Detect typing
        inputBox.addEventListener("input", () => {
            checkPrompt(inputBox);
        });

        // Detect paste
        inputBox.addEventListener("paste", () => {

            setTimeout(() => {

                checkPrompt(inputBox);

            }, 50);

        });

    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

}

function checkPrompt(inputBox) {

    const text = inputBox.innerText.trim();

    if (text.length === 0) return;

    console.log("Checking Prompt:");
    console.log(text);

    const findings = LeakDetector.detect(text);

    if (findings.length === 0) {

        popupOpen = false;
        return;

    }

    console.table(findings);

    if (popupOpen) return;

    popupOpen = true;

    showLeakGuardPopup(findings, text, inputBox);

}

function closeLeakGuardPopup() {

    popupOpen = false;

}