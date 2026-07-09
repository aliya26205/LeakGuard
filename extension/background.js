// LeakGuard - Background Service Worker

console.log("✅ LeakGuard Background Service Started");

// Supported AI Platforms
const AI_SITES = [
    "chatgpt.com",
    "chat.openai.com",
    "gemini.google.com",
    "claude.ai",
    "copilot.microsoft.com",
    "perplexity.ai",
    "grok.com"
];

// Detect when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (changeInfo.status !== "complete" || !tab.url) return;

    const matchedSite = AI_SITES.find(site => tab.url.includes(site));

    if (matchedSite) {

        console.log("🟢 LeakGuard Active on:", matchedSite);

        chrome.action.setBadgeText({
            tabId: tabId,
            text: "ON"
        });

        chrome.action.setBadgeBackgroundColor({
            color: "#16a34a" // Green
        });

    } else {

        chrome.action.setBadgeText({
            tabId: tabId,
            text: ""
        });

    }

});


// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    switch (message.type) {

        case "SENSITIVE_DATA_DETECTED":

            console.log("⚠ Sensitive Data Found");

            console.log(message.data);

            // TODO:
            // Send to backend later
            // Save to Supabase later

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

        default:

            console.log("Unknown message:", message);

            sendResponse({
                success: false
            });

    }

    return true;

});