// ======================================
// LeakGuard Detector Engine
// ======================================

console.log("🧠 LeakDetector Loaded");

const LeakDetector = {

    detect(text) {

        const findings = [];

        // -------------------------
        // Email
        // -------------------------
        if (/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(text)) {

            findings.push({
                type: "Email Address",
                risk: "Medium"
            });

        }

        // -------------------------
        // Phone Number
        // -------------------------
        if (/\b(?:\+91[- ]?)?[6-9]\d{9}\b/.test(text)) {

            findings.push({
                type: "Phone Number",
                risk: "Medium"
            });

        }

        // -------------------------
        // Aadhaar
        // -------------------------
        if (/\b\d{4}\s?\d{4}\s?\d{4}\b/.test(text)) {

            findings.push({
                type: "Aadhaar Number",
                risk: "High"
            });

        }

        // -------------------------
        // PAN Card
        // -------------------------
        if (/\b[A-Z]{5}[0-9]{4}[A-Z]\b/.test(text)) {

            findings.push({
                type: "PAN Number",
                risk: "High"
            });

        }

        // -------------------------
        // Credit Card
        // -------------------------
        if (/\b(?:\d[ -]*?){13,16}\b/.test(text)) {

            findings.push({
                type: "Credit Card",
                risk: "Critical"
            });

        }

        // -------------------------
        // API Keys
        // -------------------------
        if (/sk-[A-Za-z0-9]{20,}/.test(text)) {

            findings.push({
                type: "OpenAI API Key",
                risk: "Critical"
            });

        }

        // -------------------------
        // AWS Access Key
        // -------------------------
        if (/AKIA[0-9A-Z]{16}/.test(text)) {

            findings.push({
                type: "AWS Access Key",
                risk: "Critical"
            });

        }

        // -------------------------
        // JWT Token
        // -------------------------
        if (/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(text)) {

            findings.push({
                type: "JWT Token",
                risk: "Critical"
            });

        }

        // -------------------------
        // Password
        // -------------------------
        if (/password\s*[:=]/i.test(text)) {

            findings.push({
                type: "Password",
                risk: "Critical"
            });

        }

        // -------------------------
        // Secret
        // -------------------------
        if (/secret|private key|access token/i.test(text)) {

            findings.push({
                type: "Secret Key",
                risk: "Critical"
            });

        }

        // -------------------------
        // Confidential
        // -------------------------
        if (/confidential|internal use only|company confidential/i.test(text)) {

            findings.push({
                type: "Confidential Information",
                risk: "High"
            });

        }

        // -------------------------
        // Company Documents
        // -------------------------
        if (/salary|employee database|financial report|client list/i.test(text)) {

            findings.push({
                type: "Company Sensitive Data",
                risk: "High"
            });

        }

        return findings;

    }

};