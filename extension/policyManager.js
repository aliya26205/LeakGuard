// ======================================
// LeakGuard Policy Manager
// ======================================

console.log("🛡️ Policy Manager Loaded");

const PolicyManager = {

    enabled: true,

    riskThreshold: "Medium",

    shouldBlock(findings) {

        if (!this.enabled) return false;

        return findings.length > 0;

    }

};