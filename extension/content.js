// LeakGuard - Content Script

console.log("🛡️ LeakGuard Content Script Loaded");

// Wait until page loads
window.addEventListener("load", () => {

    startMonitoring();

});

function startMonitoring() {

    console.log("🔍 Monitoring started...");

    // Observe the page because ChatGPT loads elements dynamically
    const observer = new MutationObserver(() => {

        const inputBox = document.querySelector('[contenteditable="true"]');

        if (inputBox && !inputBox.dataset.leakguard) {

            inputBox.dataset.leakguard = "true";

            console.log("✅ Prompt box detected");

            // Detect typing
            inputBox.addEventListener("input", () => {

                const text = inputBox.innerText;

                console.log("Typing:", text);

            });

            // Detect paste
            inputBox.addEventListener("paste", () => {

                console.log("📋 Paste detected");

            });

        }

    });

    observer.observe(document.body, {

        childList: true,
        subtree: true

    });

}