// =====================================
// LeakGuard Background Service Worker
// =====================================

console.log("✅ LeakGuard Background Service Started");

// ----------------------------
// Supported AI Platforms
// ----------------------------
const AI_SITES = [
    "chatgpt.com",
    "chat.openai.com",
    "gemini.google.com",
    "claude.ai",
    "copilot.microsoft.com",
    "perplexity.ai",
    "grok.com"
];

// ----------------------------
// Load Policies from Backend
// ----------------------------
async function loadPolicies() {

    try {

        const response = await fetch("http://localhost:5000/api/policies");

        const result = await response.json();

        if (result.success) {

            await chrome.storage.local.set({
                policies: result.data
            });

            console.log("✅ Policies Loaded");

            console.log(result.data);

        } else {

            console.log("No policies received");

        }

    } catch (error) {

        console.error("Failed to load policies:", error);

    }

}

// Load once when extension starts
loadPolicies();

// Refresh every 5 minutes
setInterval(loadPolicies, 5 * 60 * 1000);

// ----------------------------
// Detect Supported AI Websites
// ----------------------------
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (changeInfo.status !== "complete" || !tab.url) return;

    const matchedSite = AI_SITES.find(site =>
        tab.url.includes(site)
    );

    if (matchedSite) {

        console.log("🟢 LeakGuard Active on:", matchedSite);

        chrome.action.setBadgeText({
            tabId,
            text: "ON"
        });

        chrome.action.setBadgeBackgroundColor({
            color: "#16a34a"
        });

    } else {

        chrome.action.setBadgeText({
            tabId,
            text: ""
        });

    }

});

// ----------------------------
// Listen for Messages
// ----------------------------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    switch (message.type) {

        case "SENSITIVE_DATA_DETECTED":

            console.log("⚠ Sensitive Data Detected");

            console.log(message.data);

            // TODO:
            // Send logs to backend
            // Store activity in Supabase
            // Generate alerts

            sendResponse({
                success: true
            });

            break;

        case "SAFE_PROMPT":

            console.log("✅ Safe Prompt");

            sendResponse({
                success: true
            });

            break;

        case "GET_POLICIES":

            chrome.storage.local.get("policies", (data) => {

                sendResponse({
                    success: true,
                    policies: data.policies || []
                });

            });

            return true;

        default:

            console.log("Unknown Message:", message);

            sendResponse({
                success: false
            });

    }

    return true;

});