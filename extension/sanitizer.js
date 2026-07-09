// ======================================
// LeakGuard Sanitizer
// ======================================

console.log("🧹 LeakGuard Sanitizer Loaded");

const Sanitizer = {

    mask(text) {

        let sanitized = text;

        // -------------------------
        // Email
        // -------------------------
        sanitized = sanitized.replace(
            /([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/g,
            "[EMAIL REDACTED]"
        );

        // -------------------------
        // Phone Number
        // -------------------------
        sanitized = sanitized.replace(
            /\b(?:\+91[- ]?)?[6-9]\d{9}\b/g,
            "[PHONE REDACTED]"
        );

        // -------------------------
        // Aadhaar
        // -------------------------
        sanitized = sanitized.replace(
            /\b\d{4}\s?\d{4}\s?\d{4}\b/g,
            "[AADHAAR REDACTED]"
        );

        // -------------------------
        // PAN
        // -------------------------
        sanitized = sanitized.replace(
            /\b[A-Z]{5}[0-9]{4}[A-Z]\b/g,
            "[PAN REDACTED]"
        );

        // -------------------------
        // Credit Card
        // -------------------------
        sanitized = sanitized.replace(
            /\b(?:\d[ -]*?){13,16}\b/g,
            "[CARD REDACTED]"
        );

        // -------------------------
        // OpenAI API Key
        // -------------------------
        sanitized = sanitized.replace(
            /sk-[A-Za-z0-9]{20,}/g,
            "[OPENAI API KEY REDACTED]"
        );

        // -------------------------
        // AWS Access Key
        // -------------------------
        sanitized = sanitized.replace(
            /AKIA[0-9A-Z]{16}/g,
            "[AWS KEY REDACTED]"
        );

        // -------------------------
        // JWT Token
        // -------------------------
        sanitized = sanitized.replace(
            /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
            "[JWT TOKEN REDACTED]"
        );

        // -------------------------
        // Password
        // -------------------------
        sanitized = sanitized.replace(
            /(password\s*[:=]\s*)(.*)/gi,
            "$1********"
        );

        // -------------------------
        // Secret Keywords
        // -------------------------
        sanitized = sanitized.replace(
            /secret|private key|access token/gi,
            "[REDACTED]"
        );

        return sanitized;

    }

};